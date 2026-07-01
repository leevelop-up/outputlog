package com.aicomm.backend.dto.response;

import com.aicomm.backend.entity.ShopItem;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ShopItemResponse {
    private Long id;
    private String name;
    private String description;
    private String type;
    private int price;
    private String itemKey;
    private boolean owned;
    private boolean equipped;

    public static ShopItemResponse from(ShopItem item, boolean owned, boolean equipped) {
        return ShopItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .type(item.getType().name())
                .price(item.getPrice())
                .itemKey(item.getItemKey())
                .owned(owned)
                .equipped(equipped)
                .build();
    }
}
