package finbarre.web.rest;

import com.codahale.metrics.annotation.Timed;
import finbarre.domain.Slonie;
import finbarre.repository.SlonieRepository;
import finbarre.web.rest.errors.BadRequestAlertException;
import finbarre.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Slonie.
 */
@RestController
@RequestMapping("/api")
public class SlonieResource {

    private final Logger log = LoggerFactory.getLogger(SlonieResource.class);

    private static final String ENTITY_NAME = "slonie";

    private final SlonieRepository slonieRepository;

    public SlonieResource(SlonieRepository slonieRepository) {
        this.slonieRepository = slonieRepository;
    }

    /**
     * POST  /slonies : Create a new slonie.
     *
     * @param slonie the slonie to create
     * @return the ResponseEntity with status 201 (Created) and with body the new slonie, or with status 400 (Bad Request) if the slonie has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/slonies")
    @Timed
    public ResponseEntity<Slonie> createSlonie(@Valid @RequestBody Slonie slonie) throws URISyntaxException {
        log.debug("REST request to save Slonie : {}", slonie);
        if (slonie.getId() != null) {
            throw new BadRequestAlertException("A new slonie cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Slonie result = slonieRepository.save(slonie);
        return ResponseEntity.created(new URI("/api/slonies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /slonies : Updates an existing slonie.
     *
     * @param slonie the slonie to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated slonie,
     * or with status 400 (Bad Request) if the slonie is not valid,
     * or with status 500 (Internal Server Error) if the slonie couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/slonies")
    @Timed
    public ResponseEntity<Slonie> updateSlonie(@Valid @RequestBody Slonie slonie) throws URISyntaxException {
        log.debug("REST request to update Slonie : {}", slonie);
        if (slonie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Slonie result = slonieRepository.save(slonie);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, slonie.getId().toString()))
            .body(result);
    }

    /**
     * GET  /slonies : get all the slonies.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of slonies in body
     */
    @GetMapping("/slonies")
    @Timed
    public List<Slonie> getAllSlonies() {
        log.debug("REST request to get all Slonies");
        return slonieRepository.findAll();
    }

    /**
     * GET  /slonies/:id : get the "id" slonie.
     *
     * @param id the id of the slonie to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the slonie, or with status 404 (Not Found)
     */
    @GetMapping("/slonies/{id}")
    @Timed
    public ResponseEntity<Slonie> getSlonie(@PathVariable Long id) {
        log.debug("REST request to get Slonie : {}", id);
        Optional<Slonie> slonie = slonieRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(slonie);
    }

    /**
     * DELETE  /slonies/:id : delete the "id" slonie.
     *
     * @param id the id of the slonie to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/slonies/{id}")
    @Timed
    public ResponseEntity<Void> deleteSlonie(@PathVariable Long id) {
        log.debug("REST request to delete Slonie : {}", id);

        slonieRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
