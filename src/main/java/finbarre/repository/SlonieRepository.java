package finbarre.repository;

import finbarre.domain.Slonie;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Slonie entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SlonieRepository extends JpaRepository<Slonie, Long> {

}
