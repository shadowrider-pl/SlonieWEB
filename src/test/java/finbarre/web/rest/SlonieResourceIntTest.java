package finbarre.web.rest;

import finbarre.SlonieWebApp;

import finbarre.domain.Slonie;
import finbarre.repository.SlonieRepository;
import finbarre.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;


import static finbarre.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SlonieResource REST controller.
 *
 * @see SlonieResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SlonieWebApp.class)
public class SlonieResourceIntTest {

    private static final String DEFAULT_PLIK = "AAAAAAAAAA";
    private static final String UPDATED_PLIK = "BBBBBBBBBB";

    private static final Long DEFAULT_WYNIK = 1L;
    private static final Long UPDATED_WYNIK = 2L;

    @Autowired
    private SlonieRepository slonieRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSlonieMockMvc;

    private Slonie slonie;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SlonieResource slonieResource = new SlonieResource(slonieRepository);
        this.restSlonieMockMvc = MockMvcBuilders.standaloneSetup(slonieResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Slonie createEntity(EntityManager em) {
        Slonie slonie = new Slonie()
            .plik(DEFAULT_PLIK)
            .wynik(DEFAULT_WYNIK);
        return slonie;
    }

    @Before
    public void initTest() {
        slonie = createEntity(em);
    }

    @Test
    @Transactional
    public void createSlonie() throws Exception {
        int databaseSizeBeforeCreate = slonieRepository.findAll().size();

        // Create the Slonie
        restSlonieMockMvc.perform(post("/api/slonies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(slonie)))
            .andExpect(status().isCreated());

        // Validate the Slonie in the database
        List<Slonie> slonieList = slonieRepository.findAll();
        assertThat(slonieList).hasSize(databaseSizeBeforeCreate + 1);
        Slonie testSlonie = slonieList.get(slonieList.size() - 1);
        assertThat(testSlonie.getPlik()).isEqualTo(DEFAULT_PLIK);
        assertThat(testSlonie.getWynik()).isEqualTo(DEFAULT_WYNIK);
    }

    @Test
    @Transactional
    public void createSlonieWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = slonieRepository.findAll().size();

        // Create the Slonie with an existing ID
        slonie.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSlonieMockMvc.perform(post("/api/slonies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(slonie)))
            .andExpect(status().isBadRequest());

        // Validate the Slonie in the database
        List<Slonie> slonieList = slonieRepository.findAll();
        assertThat(slonieList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkPlikIsRequired() throws Exception {
        int databaseSizeBeforeTest = slonieRepository.findAll().size();
        // set the field null
        slonie.setPlik(null);

        // Create the Slonie, which fails.

        restSlonieMockMvc.perform(post("/api/slonies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(slonie)))
            .andExpect(status().isBadRequest());

        List<Slonie> slonieList = slonieRepository.findAll();
        assertThat(slonieList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSlonies() throws Exception {
        // Initialize the database
        slonieRepository.saveAndFlush(slonie);

        // Get all the slonieList
        restSlonieMockMvc.perform(get("/api/slonies?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(slonie.getId().intValue())))
            .andExpect(jsonPath("$.[*].plik").value(hasItem(DEFAULT_PLIK.toString())))
            .andExpect(jsonPath("$.[*].wynik").value(hasItem(DEFAULT_WYNIK.intValue())));
    }
    
    @Test
    @Transactional
    public void getSlonie() throws Exception {
        // Initialize the database
        slonieRepository.saveAndFlush(slonie);

        // Get the slonie
        restSlonieMockMvc.perform(get("/api/slonies/{id}", slonie.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(slonie.getId().intValue()))
            .andExpect(jsonPath("$.plik").value(DEFAULT_PLIK.toString()))
            .andExpect(jsonPath("$.wynik").value(DEFAULT_WYNIK.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSlonie() throws Exception {
        // Get the slonie
        restSlonieMockMvc.perform(get("/api/slonies/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSlonie() throws Exception {
        // Initialize the database
        slonieRepository.saveAndFlush(slonie);

        int databaseSizeBeforeUpdate = slonieRepository.findAll().size();

        // Update the slonie
        Slonie updatedSlonie = slonieRepository.findById(slonie.getId()).get();
        // Disconnect from session so that the updates on updatedSlonie are not directly saved in db
        em.detach(updatedSlonie);
        updatedSlonie
            .plik(UPDATED_PLIK)
            .wynik(UPDATED_WYNIK);

        restSlonieMockMvc.perform(put("/api/slonies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSlonie)))
            .andExpect(status().isOk());

        // Validate the Slonie in the database
        List<Slonie> slonieList = slonieRepository.findAll();
        assertThat(slonieList).hasSize(databaseSizeBeforeUpdate);
        Slonie testSlonie = slonieList.get(slonieList.size() - 1);
        assertThat(testSlonie.getPlik()).isEqualTo(UPDATED_PLIK);
        assertThat(testSlonie.getWynik()).isEqualTo(UPDATED_WYNIK);
    }

    @Test
    @Transactional
    public void updateNonExistingSlonie() throws Exception {
        int databaseSizeBeforeUpdate = slonieRepository.findAll().size();

        // Create the Slonie

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlonieMockMvc.perform(put("/api/slonies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(slonie)))
            .andExpect(status().isBadRequest());

        // Validate the Slonie in the database
        List<Slonie> slonieList = slonieRepository.findAll();
        assertThat(slonieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSlonie() throws Exception {
        // Initialize the database
        slonieRepository.saveAndFlush(slonie);

        int databaseSizeBeforeDelete = slonieRepository.findAll().size();

        // Get the slonie
        restSlonieMockMvc.perform(delete("/api/slonies/{id}", slonie.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Slonie> slonieList = slonieRepository.findAll();
        assertThat(slonieList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Slonie.class);
        Slonie slonie1 = new Slonie();
        slonie1.setId(1L);
        Slonie slonie2 = new Slonie();
        slonie2.setId(slonie1.getId());
        assertThat(slonie1).isEqualTo(slonie2);
        slonie2.setId(2L);
        assertThat(slonie1).isNotEqualTo(slonie2);
        slonie1.setId(null);
        assertThat(slonie1).isNotEqualTo(slonie2);
    }
}
