package finbarre.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Slonie.
 */
@Entity
@Table(name = "slonie")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Slonie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "plik", nullable = false, unique = true)
    private String plik;

    @Column(name = "wynik")
    private Long wynik;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlik() {
        return plik;
    }

    public Slonie plik(String plik) {
        this.plik = plik;
        return this;
    }

    public void setPlik(String plik) {
        this.plik = plik;
    }

    public Long getWynik() {
        return wynik;
    }

    public Slonie wynik(Long wynik) {
        this.wynik = wynik;
        return this;
    }

    public void setWynik(Long wynik) {
        this.wynik = wynik;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Slonie slonie = (Slonie) o;
        if (slonie.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), slonie.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Slonie{" +
            "id=" + getId() +
            ", plik='" + getPlik() + "'" +
            ", wynik=" + getWynik() +
            "}";
    }
}
