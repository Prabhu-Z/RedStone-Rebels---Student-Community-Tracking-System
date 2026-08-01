package com.scts.repository;

import com.scts.entity.Event;
import com.scts.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCommunityId(Long communityId);
    List<Event> findByStatus(EventStatus status);

    @Query("SELECT e FROM Event e WHERE e.community.id = :communityId AND e.status = 'UPCOMING'")
    List<Event> findUpcomingEventsByCommunityId(@Param("communityId") Long communityId);

    @Query("SELECT e FROM Event e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Event> searchEvents(@Param("query") String query);
}
