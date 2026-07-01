package com.aicomm.backend.repository;

import com.aicomm.backend.entity.ShopItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {
    List<ShopItem> findAllByOrderBySortOrderAsc();
    boolean existsByItemKey(String itemKey);
}
