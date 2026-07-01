package com.aicomm.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 200)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType type;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false, unique = true, length = 50)
    private String itemKey;

    @Column(name = "sort_order")
    @Builder.Default
    private int sortOrder = 0;

    public enum ItemType {
        HAT, SHIRT, ACCESSORY, BACKGROUND
    }
}
