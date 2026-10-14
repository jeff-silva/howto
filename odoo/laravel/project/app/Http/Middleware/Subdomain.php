<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use ReflectionProperty;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;
use Symfony\Component\HttpFoundation\Response;

class Subdomain
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $subdomain = $this->getSubdomain($request->getHost());

        // Se tem subdomínio (ex: 'test'), mapeia para subdomains/test
        // Se não tem, mapeia para main
        $prefix = $subdomain ? "subdomains/{$subdomain}" : "main";

        $currentPath = ltrim($request->path(), '/');

        if (! str_starts_with($currentPath, $prefix)) {
            $newPath = '/' . trim($prefix . '/' . $currentPath, '/');

            $queryString = $request->getQueryString();
            $newUri = $queryString ? "{$newPath}?{$queryString}" : $newPath;

            $request->server->set('REQUEST_URI', $newUri);

            $refPath = new ReflectionProperty(SymfonyRequest::class, 'pathInfo');
            $refPath->setValue($request, $newPath);

            $refUri = new ReflectionProperty(SymfonyRequest::class, 'requestUri');
            $refUri->setValue($request, $newUri);
        }

        return $next($request);
    }

    /**
     * Extrai o subdomínio do host.
     */
    protected function getSubdomain(string $host): ?string
    {
        $host = strtolower(explode(':', trim($host))[0]);

        if (str_starts_with($host, 'www.')) {
            $host = substr($host, 4);
        }

        $parts = explode('.', $host);
        $count = count($parts);

        if ($count <= 1) {
            return null;
        }

        if (end($parts) === 'localhost') {
            array_pop($parts);
            return count($parts) > 0 ? implode('.', $parts) : null;
        }

        $twoLevelSuffixes = ['com', 'net', 'org', 'co', 'gov', 'edu', 'mil', 'ind', 'art', 'inf', 'blog', 'nom', 'adv'];
        $lastPart = $parts[$count - 1];
        $secondLastPart = $parts[$count - 2];

        $isTwoSegmentTld = strlen($lastPart) === 2 && in_array($secondLastPart, $twoLevelSuffixes, true);
        $domainPartsCount = $isTwoSegmentTld ? 3 : 2;

        if ($count <= $domainPartsCount) {
            return null;
        }

        $subdomainParts = array_slice($parts, 0, $count - $domainPartsCount);

        return implode('.', $subdomainParts);
    }
}
