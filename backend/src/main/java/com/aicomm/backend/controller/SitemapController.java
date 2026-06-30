package com.aicomm.backend.controller;

import com.aicomm.backend.entity.Post;
import com.aicomm.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SitemapController {

    private static final String BASE = "https://outputlog.com";
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final PostRepository postRepository;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String sitemap() {
        List<Post> posts = postRepository.findAll(
                PageRequest.of(0, 1000, Sort.by("createdAt").descending())
        ).getContent();

        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        // 정적 페이지
        String[][] statics = {
            {"/",         "daily",  "1.0"},
            {"/posts",    "hourly", "0.9"},
            {"/news",     "hourly", "0.85"},
            {"/github",   "daily",  "0.85"},
            {"/projects", "daily",  "0.8"},
            {"/question", "daily",  "0.8"},
        };
        for (String[] s : statics) {
            sb.append("  <url><loc>").append(BASE).append(s[0]).append("</loc>")
              .append("<changefreq>").append(s[1]).append("</changefreq>")
              .append("<priority>").append(s[2]).append("</priority></url>\n");
        }

        // 동적 포스트 페이지
        for (Post post : posts) {
            String date = post.getUpdatedAt() != null
                    ? post.getUpdatedAt().format(FMT)
                    : post.getCreatedAt().format(FMT);
            sb.append("  <url>")
              .append("<loc>").append(BASE).append("/posts/").append(post.getId()).append("</loc>")
              .append("<lastmod>").append(date).append("</lastmod>")
              .append("<changefreq>weekly</changefreq>")
              .append("<priority>0.7</priority>")
              .append("</url>\n");
        }

        sb.append("</urlset>");
        return sb.toString();
    }
}
