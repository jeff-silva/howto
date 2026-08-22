export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-950 text-zinc-50 selection:bg-indigo-500/30">
      <div className="relative isolate px-6 pt-14 lg:px-8 w-full">
        
        {/* Glow de fundo 1 */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-zinc-400 ring-1 ring-white/10 hover:ring-white/20 transition-all cursor-default backdrop-blur-sm">
              Projeto inicializado com sucesso.{' '}
              <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                <span className="absolute inset-0" aria-hidden="true" />
                Ver status da API <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 drop-shadow-sm pb-2">
            Acelere seu fluxo de desenvolvimento
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400 max-w-xl mx-auto font-light">
            Bem-vindo ao <strong className="text-zinc-200 font-semibold">Test Boti</strong>. Uma fundação fullstack moderna combinando a performance do FastAPI no backend com a flexibilidade do Next.js.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 transition-all hover:scale-105 active:scale-95"
            >
              Começar agora
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white transition-colors group">
              Explorar componentes <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
        
        {/* Glow de fundo 2 */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#89fc93] to-[#4f46e5] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </div>
    </main>
  );
}
