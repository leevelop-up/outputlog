package com.aicomm.backend.repository;

import com.aicomm.backend.entity.ShopItem;
import com.aicomm.backend.entity.UserItem;
import com.aicomm.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserItemRepository extends JpaRepository<UserItem, Long> {
    List<UserItem> findByUser(User user);
    List<UserItem> findByUserAndEquipped(User user, boolean equipped);
    boolean existsByUserAndItem(User user, ShopItem item);
    Optional<UserItem> findByUserAndItem(User user, ShopItem item);
    List<UserItem> findByUserAndItem_Type(User user, ShopItem.ItemType type);
}
