package com.autoflex.challenge.rawmaterial;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
class RawMaterialServiceTest {

    @Inject
    RawMaterialService rawMaterialService;

    @InjectMock
    RawMaterialRepository rawMaterialRepository;

    @Test
    void listAll_returnsAllRawMaterials() {
        RawMaterial rm1 = buildRawMaterial(1L, "Steel", new BigDecimal("100"), "kg");
        RawMaterial rm2 = buildRawMaterial(2L, "Plastic", new BigDecimal("50"), "kg");
        when(rawMaterialRepository.listAll()).thenReturn(List.of(rm1, rm2));

        List<RawMaterialResponse> result = rawMaterialService.listAll();

        assertEquals(2, result.size());
        assertEquals("Steel", result.get(0).getName());
        assertEquals("Plastic", result.get(1).getName());
    }

    @Test
    void findById_existingId_returnsRawMaterial() {
        RawMaterial rm = buildRawMaterial(1L, "Steel", new BigDecimal("100"), "kg");
        when(rawMaterialRepository.findByIdOptional(1L)).thenReturn(Optional.of(rm));

        RawMaterialResponse result = rawMaterialService.findById(1L);

        assertEquals(1L, result.getId());
        assertEquals("Steel", result.getName());
        assertEquals(new BigDecimal("100"), result.getStockQuantity());
        assertEquals("kg", result.getUnit());
    }

    @Test
    void findById_nonExistingId_throwsNotFoundException() {
        when(rawMaterialRepository.findByIdOptional(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> rawMaterialService.findById(99L));
    }

    @Test
    void create_validRequest_persistsAndReturnsRawMaterial() {
        RawMaterialRequest request = buildRequest("Aluminum", new BigDecimal("200"), "kg");

        doAnswer(invocation -> {
            RawMaterial rm = invocation.getArgument(0);
            rm.setId(5L);
            return null;
        }).when(rawMaterialRepository).persist(any(RawMaterial.class));

        RawMaterialResponse result = rawMaterialService.create(request);

        assertEquals("Aluminum", result.getName());
        assertEquals(new BigDecimal("200"), result.getStockQuantity());
        verify(rawMaterialRepository, times(1)).persist(any(RawMaterial.class));
    }

    @Test
    void update_existingId_updatesStock() {
        RawMaterial existing = buildRawMaterial(1L, "Steel", new BigDecimal("100"), "kg");
        when(rawMaterialRepository.findByIdOptional(1L)).thenReturn(Optional.of(existing));

        RawMaterialRequest request = buildRequest("Steel Premium", new BigDecimal("250"), "kg");

        RawMaterialResponse result = rawMaterialService.update(1L, request);

        assertEquals("Steel Premium", result.getName());
        assertEquals(new BigDecimal("250"), result.getStockQuantity());
    }

    @Test
    void delete_nonExistingId_throwsNotFoundException() {
        when(rawMaterialRepository.deleteById(99L)).thenReturn(false);

        assertThrows(NotFoundException.class, () -> rawMaterialService.delete(99L));
    }

    private RawMaterial buildRawMaterial(Long id, String name, BigDecimal stock, String unit) {
        RawMaterial rm = new RawMaterial();
        rm.setId(id);
        rm.setName(name);
        rm.setStockQuantity(stock);
        rm.setUnit(unit);
        return rm;
    }

    private RawMaterialRequest buildRequest(String name, BigDecimal stock, String unit) {
        RawMaterialRequest req = new RawMaterialRequest();
        req.setName(name);
        req.setStockQuantity(stock);
        req.setUnit(unit);
        return req;
    }
}
