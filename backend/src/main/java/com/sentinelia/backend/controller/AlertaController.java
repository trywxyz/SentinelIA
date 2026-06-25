package com.sentinelia.backend.controller;

import com.sentinelia.backend.model.Alerta;
import com.sentinelia.backend.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired
    private AlertaRepository alertaRepository;

    @GetMapping
    public List<Alerta> listarTodos() {
        return alertaRepository.findAllByOrderByDataHoraDesc();
    }

    @PostMapping
    public Alerta criarAlerta(@RequestBody Alerta alerta) {
        alerta.setDataHora(LocalDateTime.now());
        alerta.setStatus("ATIVO");
        return alertaRepository.save(alerta);
    }
}