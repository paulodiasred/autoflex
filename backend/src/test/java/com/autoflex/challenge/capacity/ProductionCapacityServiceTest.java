package com.autoflex.challenge.capacity;

import com.autoflex.challenge.product.Product;
import com.autoflex.challenge.product.ProductRepository;
import com.autoflex.challenge.productmaterial.ProductMaterial;
import com.autoflex.challenge.rawmaterial.RawMaterial;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@QuarkusTest
class ProductionCapacityServiceTest {

    @Inject
    ProductionCapacityService productionCapacityService;

    @InjectMock
    ProductRepository productRepository;

    /**
     * Cenário principal: produto com dois insumos.
     * Steel: estoque=100, necessário=2  → 100/2 = 50
     * Plastic: estoque=30, necessário=3 → 30/3 = 10
     * Resultado esperado: min(50, 10) = 10 unidades
     */
    @Test
    void calculateAll_productWithTwoMaterials_returnsMinimumPossible() {
        RawMaterial steel  = buildRawMaterial(1L, "Steel",  new BigDecimal("100"), "kg");
        RawMaterial plastic = buildRawMaterial(2L, "Plastic", new BigDecimal("30"),  "kg");

        Product product = buildProduct(1L, "Chair",
                List.of(
                        buildAssociation(steel,  new BigDecimal("2")),
                        buildAssociation(plastic, new BigDecimal("3"))
                )
        );

        when(productRepository.listAll()).thenReturn(List.of(product));

        List<ProductionCapacityResponse> result = productionCapacityService.calculateAll();

        assertEquals(1, result.size());
        assertEquals(new BigDecimal("10"), result.get(0).getProducibleQuantity());
        assertEquals("Chair", result.get(0).getProductName());
    }

    /**
     * Produto sem materiais cadastrados → não aparece no resultado.
     */
    @Test
    void calculateAll_productWithNoMaterials_isExcludedFromResult() {
        Product product = buildProduct(1L, "Ghost Product", List.of());
        when(productRepository.listAll()).thenReturn(List.of(product));

        List<ProductionCapacityResponse> result = productionCapacityService.calculateAll();

        assertTrue(result.isEmpty());
    }

    /**
     * Estoque insuficiente para qualquer unidade → não aparece no resultado.
     * Steel: estoque=1, necessário=5 → floor(1/5) = 0
     */
    @Test
    void calculateAll_insufficientStock_isExcludedFromResult() {
        RawMaterial steel = buildRawMaterial(1L, "Steel", new BigDecimal("1"), "kg");

        Product product = buildProduct(1L, "Table",
                List.of(buildAssociation(steel, new BigDecimal("5")))
        );

        when(productRepository.listAll()).thenReturn(List.of(product));

        List<ProductionCapacityResponse> result = productionCapacityService.calculateAll();

        assertTrue(result.isEmpty());
    }

    /**
     * Um produto viável e outro inviável → apenas o viável aparece.
     */
    @Test
    void calculateAll_mixedProducts_returnsOnlyFeasibleOnes() {
        RawMaterial iron  = buildRawMaterial(1L, "Iron",  new BigDecimal("50"), "kg");
        RawMaterial wood  = buildRawMaterial(2L, "Wood",  new BigDecimal("1"),  "m3");

        Product feasible = buildProduct(1L, "Nail",
                List.of(buildAssociation(iron, new BigDecimal("2")))
        );
        Product infeasible = buildProduct(2L, "Table",
                List.of(buildAssociation(wood, new BigDecimal("5")))
        );

        when(productRepository.listAll()).thenReturn(List.of(feasible, infeasible));

        List<ProductionCapacityResponse> result = productionCapacityService.calculateAll();

        assertEquals(1, result.size());
        assertEquals("Nail", result.get(0).getProductName());
        assertEquals(new BigDecimal("25"), result.get(0).getProducibleQuantity());
    }

    /**
     * Estoque exatamente suficiente para 1 unidade.
     * Steel: estoque=2, necessário=2 → floor(2/2) = 1
     */
    @Test
    void calculateAll_exactlyEnoughForOne_returnsOne() {
        RawMaterial steel = buildRawMaterial(1L, "Steel", new BigDecimal("2"), "kg");

        Product product = buildProduct(1L, "Bolt",
                List.of(buildAssociation(steel, new BigDecimal("2")))
        );

        when(productRepository.listAll()).thenReturn(List.of(product));

        List<ProductionCapacityResponse> result = productionCapacityService.calculateAll();

        assertEquals(1, result.size());
        assertEquals(new BigDecimal("1"), result.get(0).getProducibleQuantity());
    }

    /**
     * Garante arredondamento para baixo (floor), nunca arredonda para cima.
     * Steel: estoque=10, necessário=3 → floor(10/3) = 3 (não 4)
     */
    @Test
    void calculateAll_nonDivisibleStock_floorsResult() {
        RawMaterial steel = buildRawMaterial(1L, "Steel", new BigDecimal("10"), "kg");

        Product product = buildProduct(1L, "Widget",
                List.of(buildAssociation(steel, new BigDecimal("3")))
        );

        when(productRepository.listAll()).thenReturn(List.of(product));

        List<ProductionCapacityResponse> result = productionCapacityService.calculateAll();

        assertEquals(1, result.size());
        assertEquals(new BigDecimal("3"), result.get(0).getProducibleQuantity());
    }

    // --- helpers ---

    private RawMaterial buildRawMaterial(Long id, String name, BigDecimal stock, String unit) {
        RawMaterial rm = new RawMaterial();
        rm.setId(id);
        rm.setName(name);
        rm.setStockQuantity(stock);
        rm.setUnit(unit);
        return rm;
    }

    private Product buildProduct(Long id, String name, List<ProductMaterial> materials) {
        Product p = new Product();
        p.setId(id);
        p.setName(name);
        p.setMaterials(materials);
        return p;
    }

    private ProductMaterial buildAssociation(RawMaterial rawMaterial, BigDecimal requiredQuantity) {
        ProductMaterial pm = new ProductMaterial();
        pm.setRawMaterial(rawMaterial);
        pm.setRequiredQuantity(requiredQuantity);
        return pm;
    }
}
