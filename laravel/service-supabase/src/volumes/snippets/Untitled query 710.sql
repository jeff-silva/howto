CREATE TABLE IF NOT EXISTS shop_products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    promo_price DECIMAL(10, 2) DEFAULT NULL,
    promo_start DATE DEFAULT NULL,
    promo_final DATE DEFAULT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar segurança de linha (RLS) - Padrão recomendado no Supabase
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;

-- Criar política permitindo que qualquer pessoa consulte a tabela
CREATE POLICY "Allow public read access" ON shop_products
    FOR SELECT USING (true);
