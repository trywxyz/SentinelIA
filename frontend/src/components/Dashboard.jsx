import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
    const [alertas, setAlertas] = useState([]);
    const [alertasFiltrados, setAlertasFiltrados] = useState([]);
    const [filtroTipo, setFiltroTipo] = useState('TODOS');
    const [termoBusca, setTermoBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const [metricas, setMetricas] = useState({ total: 0, criticos: 0, resolvidos: 0 });

    useEffect(() => {
        fetch('http://localhost:8080/api/alertas')
            .then(response => response.status === 200 ? response.json() : [])
            .then(data => {
                setAlertas(data);
                setAlertasFiltrados(data);
                atualizarMetricas(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao procurar alertas:", error);
                setLoading(false);
            });
    }, []);

    // Monitoriza filtros e termos de busca
    useEffect(() => {
        let resultado = alertas;

        if (filtroTipo !== 'TODOS') {
            resultado = resultado.filter(a => a.tipo === filtroTipo);
        }

        if (termoBusca.trim() !== '') {
            const termo = termoBusca.toLowerCase();
            resultado = resultado.filter(a => 
                a.descricao.toLowerCase().includes(termo) || 
                (a.sensor && a.sensor.nome.toLowerCase().includes(termo)) ||
                (a.sensor && a.sensor.localizacao.toLowerCase().includes(termo))
            );
        }

        setAlertasFiltrados(resultado);
    }, [filtroTipo, termoBusca, alertas]);

    const atualizarMetricas = (data) => {
        const criticos = data.filter(a => a.tipo === 'CRÍTICO' && a.status === 'ATIVO').length;
        const resolvidos = data.filter(a => a.status === 'RESOLVIDO').length;
        setMetricas({ total: data.length, criticos, resolvidos });
    };

    // Função interativa: Altera o estado do alerta no Frontend em tempo real
    const resolverAlerta = (id) => {
        const alertasAtualizados = alertas.map(alerta => {
            if (alerta.id === id) {
                return { ...alerta, status: 'RESOLVIDO' };
            }
            return alerta;
        });
        
        setAlertas(alertasAtualizados);
        atualizarMetricas(alertasAtualizados);
    };

    return (
        <div className="dashboard-container fade-in">
            <nav className="navbar">
                <div className="nav-brand">
                    <div className="brand-logo">🛡️</div>
                    <div>
                        <span className="brand-name">Sentinel <span className="brand-gradient">IA</span></span>
                        <span className="badge-version">v1.2 Live</span>
                    </div>
                </div>
                <div className="nav-status">
                    <div className="pulse-dot"></div>
                    <span>Central Sincronizada</span>
                </div>
            </nav>

            <main className="main-content">
                <header className="welcome-header">
                    <h1>Consola de Segurança</h1>
                    <p>Módulo de telemetria residencial com ações de mitigação rápida.</p>
                </header>

                {/* Cards de Métricas com Design Avançado */}
                <section className="stats-grid">
                    <div className="stat-card bg-card-blue">
                        <span className="stat-label">Eventos Totais</span>
                        <div className="stat-row">
                            <span className="stat-number">{metricas.total}</span>
                            <span className="stat-icon-circle blue">📊</span>
                        </div>
                    </div>
                    <div className="stat-card bg-card-red relative-card">
                        <span className="stat-label">Ações Críticas Pendentes</span>
                        <div className="stat-row">
                            <span className="stat-number">{metricas.criticos}</span>
                            <span className="stat-icon-circle red animate-bounce">🚨</span>
                        </div>
                        {metricas.criticos > 0 && <span className="card-badge-pulse">Requer Atenção</span>}
                    </div>
                    <div className="stat-card bg-card-green">
                        <span className="stat-label">Mitigados (Histórico)</span>
                        <div className="stat-row">
                            <span className="stat-number">{metricas.resolvidos}</span>
                            <span className="stat-icon-circle green">🛡️</span>
                        </div>
                    </div>
                </section>

                <section className="data-panel">
                    <div className="panel-toolbar">
                        <div className="search-wrapper">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Filtrar por divisão, sensor ou ameaça..." 
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                                className="search-input"
                            />
                            {termoBusca && <button className="clear-search" onClick={() => setTermoBusca('')}>✕</button>}
                        </div>

                        <div className="segment-control">
                            <button className={`segment-btn ${filtroTipo === 'TODOS' ? 'active' : ''}`} onClick={() => setFiltroTipo('TODOS')}>Todos</button>
                            <button className={`segment-btn ${filtroTipo === 'CRÍTICO' ? 'active-red' : ''}`} onClick={() => setFiltroTipo('CRÍTICO')}>Críticos</button>
                            <button className={`segment-btn ${filtroTipo === 'ATENÇÃO' ? 'active-yellow' : ''}`} onClick={() => setFiltroTipo('ATENÇÃO')}>Atenção</button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="shimmer-spinner"></div>
                            <p>A carregar base H2...</p>
                        </div>
                    ) : alertasFiltrados.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">🍃</span>
                            <h4>Ambiente Seguro</h4>
                            <p>Nenhuma ocorrência interceptada com os filtros atuais.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Data/Hora</th>
                                        <th>Dispositivo</th>
                                        <th>Divisão</th>
                                        <th>Severidade</th>
                                        <th>Análise da Ocorrência</th>
                                        <th>Estado</th>
                                        <th className="text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alertasFiltrados.map(alerta => (
                                        <tr key={alerta.id} className="interactive-row">
                                            <td className="font-mono text-muted">
                                                {new Date(alerta.dataHora).toLocaleDateString('pt-PT')} {new Date(alerta.dataHora).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}
                                            </td>
                                            <td className="font-semibold text-dark">
                                                {alerta.sensor ? alerta.sensor.nome : 'Módulo Central'}
                                            </td>
                                            <td>
                                                <span className="pill-location">
                                                    📍 {alerta.sensor ? alerta.sensor.localizacao : 'Geral'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-tag tag-${alerta.tipo.toLowerCase()}`}>
                                                    {alerta.tipo}
                                                </span>
                                            </td>
                                            <td className="text-description">{alerta.descricao}</td>
                                            <td>
                                                <span className={`state-indicator state-${alerta.status.toLowerCase()}`}>
                                                    {alerta.status}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {alerta.status === 'ATIVO' ? (
                                                    <button 
                                                        className="action-resolve-btn"
                                                        onClick={() => resolverAlerta(alerta.id)}
                                                    >
                                                        Mitigar
                                                    </button>
                                                ) : (
                                                    <span className="action-done-text">✓ Resolvido</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;