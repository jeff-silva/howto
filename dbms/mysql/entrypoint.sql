-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS app;
GRANT ALL ON *.* TO 'app'@'%';

-- Usa o banco de dados criado
USE app;

-- -----------------------------------------------------
-- Table `app_user`
-- Armazena informações de todos os usuários (passageiros e motoristas)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_user` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `phone_number` VARCHAR(20) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL, -- Armazenar hash da senha, nunca a senha em texto claro
  `role` ENUM('passenger', 'driver', 'admin') NOT NULL, -- Define o tipo de usuário
  `rating` DECIMAL(2,1) DEFAULT 0.0, -- Média de avaliação (para passageiro e motorista)
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE -- Indica se o usuário está ativo
);

-- -----------------------------------------------------
-- Table `uber_vehicle`
-- Armazena informações dos veículos dos motoristas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `uber_vehicle` (
  `vehicle_id` INT AUTO_INCREMENT PRIMARY KEY,
  `driver_id` INT UNIQUE NOT NULL, -- Um motorista tem apenas um veículo principal
  `make` VARCHAR(100) NOT NULL,     -- Fabricante (ex: Toyota)
  `model` VARCHAR(100) NOT NULL,    -- Modelo (ex: Corolla)
  `year` INT NOT NULL,              -- Ano do veículo
  `license_plate` VARCHAR(20) UNIQUE NOT NULL, -- Placa do veículo
  `color` VARCHAR(50) NOT NULL,
  `capacity` INT DEFAULT 4,         -- Capacidade de passageiros
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE, -- Indica se o veículo está ativo para corridas

  CONSTRAINT fk_uber_vehicle_driver_id
    FOREIGN KEY (`driver_id`)
    REFERENCES `app_user`(`user_id`)
    ON DELETE CASCADE -- Se o motorista for deletado, o veículo também é
    ON UPDATE CASCADE -- Se o ID do motorista mudar, atualiza aqui
);

-- -----------------------------------------------------
-- Table `uber_ride`
-- Armazena informações gerais sobre as solicitações de corrida
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `uber_ride` (
  `ride_id` INT AUTO_INCREMENT PRIMARY KEY,
  `passenger_id` INT NOT NULL,
  `driver_id` INT, -- Pode ser NULL se a corrida ainda não foi aceita por um motorista
  `status` ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `fare_amount` DECIMAL(10, 2), -- Valor da corrida (pode ser calculado após aceitação ou conclusão)
  `distance_km` DECIMAL(10, 2), -- Distância total da corrida em km
  `duration_minutes` DECIMAL(10, 2), -- Duração total da corrida em minutos
  `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `accepted_at` TIMESTAMP, -- Quando o motorista aceitou
  `started_at` TIMESTAMP,  -- Quando a corrida realmente começou (primeira parada concluída)
  `completed_at` TIMESTAMP, -- Quando a corrida terminou (última parada concluída)
  `cancelled_by` ENUM('passenger', 'driver'), -- Quem cancelou a corrida
  `cancellation_reason` TEXT, -- Motivo do cancelamento (se houver)

  CONSTRAINT fk_uber_ride_passenger_id
    FOREIGN KEY (`passenger_id`)
    REFERENCES `app_user`(`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_uber_ride_driver_assigned_id
    FOREIGN KEY (`driver_id`)
    REFERENCES `app_user`(`user_id`)
    ON DELETE SET NULL -- Se o motorista for deletado, a corrida não é deletada, apenas o driver_id fica NULL
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `uber_ride_stop`
-- Armazena cada parada de uma corrida
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `uber_ride_stop` (
  `stop_id` INT AUTO_INCREMENT PRIMARY KEY,
  `ride_id` INT NOT NULL,
  `latitude` DECIMAL(10, 8) NOT NULL,
  `longitude` DECIMAL(11, 8) NOT NULL,
  `address` VARCHAR(255), -- Endereço textual da parada (opcional, para visualização)
  `stop_order` INT NOT NULL, -- A ordem da parada na viagem (1 para pickup, 2 para primeira interm., etc.)
  `stop_type` ENUM('pickup', 'intermediate', 'dropoff') NOT NULL, -- Tipo da parada
  `arrival_time` TIMESTAMP, -- Quando o motorista chegou na parada
  `departure_time` TIMESTAMP, -- Quando o motorista partiu da parada

  CONSTRAINT fk_uber_ride_stop_ride_id
    FOREIGN KEY (`ride_id`)
    REFERENCES `uber_ride`(`ride_id`)
    ON DELETE CASCADE -- Se a corrida for deletada, suas paradas também são
    ON UPDATE CASCADE,

  -- Garante que não haja duas paradas com a mesma ordem na mesma corrida
  UNIQUE (`ride_id`, `stop_order`)
);
