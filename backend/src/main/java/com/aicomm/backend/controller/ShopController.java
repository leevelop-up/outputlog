package com.aicomm.backend.controller;

import com.aicomm.backend.dto.response.ShopItemResponse;
import com.aicomm.backend.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping("/items")
    public ResponseEntity<List<ShopItemResponse>> getAllItems() {
        return ResponseEntity.ok(shopService.getAllItems());
    }

    @GetMapping("/my-items")
    public ResponseEntity<List<ShopItemResponse>> getMyItems() {
        return ResponseEntity.ok(shopService.getMyItems());
    }

    @PostMapping("/items/{id}/buy")
    public ResponseEntity<Map<String, String>> buyItem(@PathVariable Long id) {
        shopService.buyItem(id);
        return ResponseEntity.ok(Map.of("message", "구매 완료"));
    }

    @PutMapping("/items/{id}/equip")
    public ResponseEntity<Map<String, String>> equipItem(@PathVariable Long id) {
        return ResponseEntity.ok(shopService.equipItem(id));
    }

    @GetMapping("/users/{userId}/equipped")
    public ResponseEntity<List<ShopItemResponse>> getEquipped(@PathVariable Long userId) {
        return ResponseEntity.ok(shopService.getEquippedItems(userId));
    }
}
