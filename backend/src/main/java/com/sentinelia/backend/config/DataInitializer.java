package com.sentinelia.backend.config;

import com.sentinelia.backend.model.Alerta;
import com.sentinelia.backend.model.Sensor;
import com.sentinelia.backend.repository.AlertaRepository;
import com.sentinelia.backend.repository.SensorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(SensorRepository sensorRepo, AlertaRepository alertaRepo) {
        return args -> {
            // ---------------------------------------------------------
            // 1. CADASTRO DE SENSORES (DISPOSITIVOS IOT)
            // ---------------------------------------------------------
            Sensor s1 = sensorRepo.save(new Sensor("Sensor de Presença 01", "Presença", "Sala de Estar", "ATIVO"));
            Sensor s2 = sensorRepo.save(new Sensor("Sensor de Fumaça 01", "Fumaça", "Cozinha", "ATIVO"));
            Sensor s3 = sensorRepo.save(new Sensor("Sensor de Janela 01", "Abertura", "Quarto Principal", "ATIVO"));
            Sensor s4 = sensorRepo.save(new Sensor("Sensor de Inundação 01", "Inundação", "Lavandaria", "ATIVO"));
            Sensor s5 = sensorRepo.save(new Sensor("Barreira Infravermelha 01", "Perímetro", "Quintal Traseiro", "ATIVO"));
            Sensor s6 = sensorRepo.save(new Sensor("Sensor de Portão 01", "Abertura", "Garagem", "ATIVO"));
            Sensor s7 = sensorRepo.save(new Sensor("Sensor de Presença 02", "Presença", "Escritório", "INATIVO")); // Simular um sensor offline

            // ---------------------------------------------------------
            // 2. HISTÓRICO DE ALERTAS E OCORRÊNCIAS
            // ---------------------------------------------------------

            // Alerta 1: Crítico e Ativo (Invasão)
            alertaRepo.save(new Alerta(
                    "CRÍTICO",
                    "Intrusão detetada! Quebra da barreira infravermelha externa.",
                    LocalDateTime.now().minusMinutes(5),
                    "ATIVO",
                    s5
            ));

            // Alerta 2: Crítico e Ativo (Fogo/Fumaça)
            alertaRepo.save(new Alerta(
                    "CRÍTICO",
                    "Altos índices de monóxido de carbono detetados suspensos no ar.",
                    LocalDateTime.now().minusMinutes(12),
                    "ATIVO",
                    s2
            ));

            // Alerta 3: Atenção e Ativo (Esquecimento)
            alertaRepo.save(new Alerta(
                    "ATENÇÃO",
                    "Portão da garagem aberto há mais de 20 minutos em horário atípico.",
                    LocalDateTime.now().minusMinutes(45),
                    "ATIVO",
                    s6
            ));

            // Alerta 4: Atenção e Resolvido (Janela aberta)
            alertaRepo.save(new Alerta(
                    "ATENÇÃO",
                    "Janela do Quarto Principal permaneceu aberta durante período de chuva intensa.",
                    LocalDateTime.now().minusHours(2),
                    "RESOLVIDO",
                    s3
            ));

            // Alerta 5: Crítico e Resolvido (Vazamento de água mitigado)
            alertaRepo.save(new Alerta(
                    "CRÍTICO",
                    "Acúmulo de água detetado no piso da lavandaria. Fluxo de entrada interrompido.",
                    LocalDateTime.now().minusHours(5),
                    "RESOLVIDO",
                    s4
            ));

            // Alerta 6: Atenção e Resolvido (Falso positivo ou circulação comum)
            alertaRepo.save(new Alerta(
                    "ATENÇÃO",
                    "Movimentação suspeita detetada na Sala de Estar de madrugada.",
                    LocalDateTime.now().minusDays(1),
                    "RESOLVIDO",
                    s1
            ));

            // Alerta 7: Atenção e Resolvido (Histórico antigo)
            alertaRepo.save(new Alerta(
                    "ATENÇÃO",
                    "Flutuação de sinal identificada no sensor do Escritório antes de entrar em manutenção.",
                    LocalDateTime.now().minusDays(3),
                    "RESOLVIDO",
                    s7
            ));
        };
    }
}