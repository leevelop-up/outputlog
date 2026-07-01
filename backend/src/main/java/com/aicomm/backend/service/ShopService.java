package com.aicomm.backend.service;

import com.aicomm.backend.dto.response.ShopItemResponse;
import com.aicomm.backend.entity.ShopItem;
import com.aicomm.backend.entity.User;
import com.aicomm.backend.entity.UserItem;
import com.aicomm.backend.exception.BusinessException;
import com.aicomm.backend.repository.ShopItemRepository;
import com.aicomm.backend.repository.UserItemRepository;
import com.aicomm.backend.repository.UserRepository;
import com.aicomm.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopItemRepository shopItemRepository;
    private final UserItemRepository userItemRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ShopItemResponse> getAllItems() {
        List<ShopItem> items = shopItemRepository.findAllByOrderBySortOrderAsc();
        try {
            Long userId = SecurityUtil.getCurrentUserId();
            User user = userRepository.findById(userId).orElseThrow();
            List<UserItem> myItems = userItemRepository.findByUser(user);
            Set<Long> ownedIds = myItems.stream().map(ui -> ui.getItem().getId()).collect(Collectors.toSet());
            Set<Long> equippedIds = myItems.stream().filter(UserItem::isEquipped).map(ui -> ui.getItem().getId()).collect(Collectors.toSet());
            return items.stream()
                    .map(i -> ShopItemResponse.from(i, ownedIds.contains(i.getId()), equippedIds.contains(i.getId())))
                    .toList();
        } catch (Exception e) {
            return items.stream().map(i -> ShopItemResponse.from(i, false, false)).toList();
        }
    }

    @Transactional(readOnly = true)
    public List<ShopItemResponse> getMyItems() {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow();
        List<UserItem> myItems = userItemRepository.findByUser(user);
        return myItems.stream()
                .map(ui -> ShopItemResponse.from(ui.getItem(), true, ui.isEquipped()))
                .toList();
    }

    @Transactional
    public void buyItem(Long itemId) {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow();
        ShopItem item = shopItemRepository.findById(itemId)
                .orElseThrow(() -> BusinessException.notFound("아이템을 찾을 수 없습니다."));

        if (userItemRepository.existsByUserAndItem(user, item)) {
            throw BusinessException.conflict("이미 보유한 아이템입니다.");
        }
        if (user.getPoints() < item.getPrice()) {
            throw BusinessException.badRequest("포인트가 부족합니다.");
        }

        user.addPoints(-item.getPrice());
        userRepository.save(user);
        userItemRepository.save(UserItem.builder().user(user).item(item).equipped(false).build());
    }

    @Transactional
    public Map<String, String> equipItem(Long itemId) {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow();
        ShopItem item = shopItemRepository.findById(itemId)
                .orElseThrow(() -> BusinessException.notFound("아이템을 찾을 수 없습니다."));

        UserItem userItem = userItemRepository.findByUserAndItem(user, item)
                .orElseThrow(() -> BusinessException.badRequest("보유하지 않은 아이템입니다."));

        // 같은 타입 기존 장착 해제
        List<UserItem> sameType = userItemRepository.findByUserAndItem_Type(user, item.getType());
        sameType.forEach(UserItem::unequip);
        userItemRepository.saveAll(sameType);

        // 토글: 이미 장착 중이면 해제
        if (userItem.isEquipped()) {
            userItem.unequip();
        } else {
            userItem.equip();
        }
        userItemRepository.save(userItem);
        return Map.of("equipped", String.valueOf(userItem.isEquipped()));
    }

    @Transactional(readOnly = true)
    public List<ShopItemResponse> getEquippedItems(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return userItemRepository.findByUserAndEquipped(user, true).stream()
                .map(ui -> ShopItemResponse.from(ui.getItem(), true, true))
                .toList();
    }
}
