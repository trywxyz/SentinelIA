package com.sentinelia.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;
    private String descricao;
    private LocalDateTime dataHora;
    private String status;

    @ManyToOne
    @JoinColumn(name = "sensor_id")
    private Sensor sensor;

    // Construtor personalizado para o DataInitializer (sem o ID)
    public Alerta(String tipo, String descricao, LocalDateTime dataHora, String status, Sensor sensor) {
        this.tipo = tipo;
        this.descricao = descricao;
        this.dataHora = dataHora;
        this.status = status;
        this.sensor = sensor;
    }

    // Getters e Setters (LOMBOK SEM FUNCIONAR)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Sensor getSensor() { return sensor; }
    public void setSensor(Sensor sensor) { this.sensor = sensor; }
}