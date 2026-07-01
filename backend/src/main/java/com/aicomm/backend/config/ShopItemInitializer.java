package com.aicomm.backend.config;

import com.aicomm.backend.entity.ShopItem;
import com.aicomm.backend.repository.ShopItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ShopItemInitializer implements ApplicationRunner {

    private final ShopItemRepository shopItemRepository;

    @Override
    public void run(ApplicationArguments args) {
        List<ShopItem> items = List.of(
            // HAT
            item("야구모자", "캐주얼한 야구모자", ShopItem.ItemType.HAT, 50, "hat_baseball", 1),
            item("왕관", "황금 왕관", ShopItem.ItemType.HAT, 300, "hat_crown", 2),
            item("개발자 헤드셋", "노이즈 캔슬링 헤드셋", ShopItem.ItemType.HAT, 150, "hat_headset", 3),
            item("마법사 모자", "신비로운 마법사의 모자", ShopItem.ItemType.HAT, 400, "hat_wizard", 4),
            item("비니", "따뜻한 겨울 비니", ShopItem.ItemType.HAT, 80, "hat_beanie", 5),

            // SHIRT
            item("후드티", "편한 개발자 후드티", ShopItem.ItemType.SHIRT, 80, "shirt_hoodie", 10),
            item("정장", "깔끔한 정장 재킷", ShopItem.ItemType.SHIRT, 200, "shirt_suit", 11),
            item("우주복", "우주를 향한 우주복", ShopItem.ItemType.SHIRT, 500, "shirt_space", 12),
            item("닌자복", "은밀한 닌자 의상", ShopItem.ItemType.SHIRT, 300, "shirt_ninja", 13),
            item("하와이안 셔츠", "휴가 기분 물씬", ShopItem.ItemType.SHIRT, 100, "shirt_hawaii", 14),

            // ACCESSORY
            item("안경", "스마트한 뿔테 안경", ShopItem.ItemType.ACCESSORY, 50, "acc_glasses", 20),
            item("선글라스", "쿨한 선글라스", ShopItem.ItemType.ACCESSORY, 80, "acc_sunglasses", 21),
            item("커피컵", "항상 손에 커피", ShopItem.ItemType.ACCESSORY, 40, "acc_coffee", 22),
            item("노트북", "어디서나 코딩", ShopItem.ItemType.ACCESSORY, 120, "acc_laptop", 23),
            item("검", "용사의 검", ShopItem.ItemType.ACCESSORY, 250, "acc_sword", 24),
            item("마이크", "스트리머 마이크", ShopItem.ItemType.ACCESSORY, 150, "acc_mic", 25),

            // BACKGROUND
            item("코드 배경", "초록 코드 비가 내리는 배경", ShopItem.ItemType.BACKGROUND, 100, "bg_matrix", 30),
            item("우주 배경", "별이 빛나는 우주", ShopItem.ItemType.BACKGROUND, 150, "bg_space", 31),
            item("숲 배경", "싱그러운 자연 속", ShopItem.ItemType.BACKGROUND, 100, "bg_forest", 32),
            item("도시 야경", "화려한 도시의 밤", ShopItem.ItemType.BACKGROUND, 120, "bg_city", 33),
            item("노을 배경", "따뜻한 노을빛", ShopItem.ItemType.BACKGROUND, 80, "bg_sunset", 34)
        );

        for (ShopItem item : items) {
            if (!shopItemRepository.existsByItemKey(item.getItemKey())) {
                shopItemRepository.save(item);
            }
        }
    }

    private ShopItem item(String name, String desc, ShopItem.ItemType type, int price, String key, int order) {
        return ShopItem.builder()
                .name(name).description(desc).type(type)
                .price(price).itemKey(key).sortOrder(order)
                .build();
    }
}
