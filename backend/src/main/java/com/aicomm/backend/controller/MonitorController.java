package com.aicomm.backend.controller;

import com.aicomm.backend.repository.PostRepository;
import com.aicomm.backend.repository.UserRepository;
import com.aicomm.backend.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/monitor")
@RequiredArgsConstructor
public class MonitorController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        Map<String, Object> result = new LinkedHashMap<>();

        // ── JVM 메모리 ──
        MemoryMXBean mem = ManagementFactory.getMemoryMXBean();
        long heapUsed  = mem.getHeapMemoryUsage().getUsed();
        long heapMax   = mem.getHeapMemoryUsage().getMax();
        long heapCommit= mem.getHeapMemoryUsage().getCommitted();

        Map<String, Object> jvm = new LinkedHashMap<>();
        jvm.put("heapUsedMB",   heapUsed   / 1024 / 1024);
        jvm.put("heapMaxMB",    heapMax    / 1024 / 1024);
        jvm.put("heapCommitMB", heapCommit / 1024 / 1024);
        jvm.put("heapUsedPct",  heapMax > 0 ? (int)((heapUsed * 100) / heapMax) : 0);
        result.put("jvm", jvm);

        // ── OS / CPU ──
        OperatingSystemMXBean os = ManagementFactory.getOperatingSystemMXBean();
        Map<String, Object> system = new LinkedHashMap<>();
        system.put("availableProcessors", os.getAvailableProcessors());
        system.put("loadAverage", os.getSystemLoadAverage());
        system.put("osName",    os.getName());
        system.put("osVersion", os.getVersion());
        system.put("arch",      os.getArch());

        // com.sun.management.OperatingSystemMXBean 사용 가능하면 CPU/메모리 상세
        if (os instanceof com.sun.management.OperatingSystemMXBean sunOs) {
            long totalMem = sunOs.getTotalMemorySize();
            long freeMem  = sunOs.getFreeMemorySize();
            system.put("totalMemMB",    totalMem / 1024 / 1024);
            system.put("freeMemMB",     freeMem  / 1024 / 1024);
            system.put("usedMemMB",     (totalMem - freeMem) / 1024 / 1024);
            system.put("memUsedPct",    totalMem > 0 ? (int)(((totalMem - freeMem) * 100) / totalMem) : 0);
            system.put("cpuLoadPct",    (int)(sunOs.getCpuLoad() * 100));
            system.put("processCpuPct", (int)(sunOs.getProcessCpuLoad() * 100));
        }
        result.put("system", system);

        // ── JVM 업타임 ──
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        Map<String, Object> runtime = new LinkedHashMap<>();
        runtime.put("uptimeMs",  uptimeMs);
        runtime.put("uptimeMin", uptimeMs / 1000 / 60);
        runtime.put("uptimeHr",  uptimeMs / 1000 / 60 / 60);
        result.put("runtime", runtime);

        // ── DB 통계 ──
        Map<String, Object> db = new LinkedHashMap<>();
        db.put("totalPosts",    postRepository.count());
        db.put("totalUsers",    userRepository.count());
        db.put("totalComments", commentRepository.count());
        result.put("db", db);

        // ── 스레드 ──
        Map<String, Object> threads = new LinkedHashMap<>();
        threads.put("threadCount",        ManagementFactory.getThreadMXBean().getThreadCount());
        threads.put("peakThreadCount",    ManagementFactory.getThreadMXBean().getPeakThreadCount());
        threads.put("daemonThreadCount",  ManagementFactory.getThreadMXBean().getDaemonThreadCount());
        result.put("threads", threads);

        result.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(result);
    }
}
