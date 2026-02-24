// Desenvolvido por Paulo Dias - Autoflex Challenge 2026
package com.autoflex.challenge.capacity;

import com.autoflex.challenge.product.Product;
import com.autoflex.challenge.product.ProductRepository;
import com.autoflex.challenge.productmaterial.ProductMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@ApplicationScoped
public class ProductionCapacityService {

    @Inject
    ProductRepository productRepository;

    public List<ProductionCapacityResponse> calculateAll() {
        return productRepository.listAll()
                .stream()
                .map(this::calculateForProduct)
                .toList();
    }

    private ProductionCapacityResponse calculateForProduct(Product product) {
        List<ProductMaterial> materials = product.getMaterials();

        List<ProductionCapacityResponse.MaterialDetail> details = materials.stream()
                .map(pm -> new ProductionCapacityResponse.MaterialDetail(
                        pm.getRawMaterial().getName(),
                        pm.getRawMaterial().getUnit(),
                        pm.getRequiredQuantity(),
                        pm.getRawMaterial().getStockQuantity()
                ))
                .toList();

        if (materials.isEmpty()) {
            return new ProductionCapacityResponse(product.getId(), product.getName(), BigDecimal.ZERO, details);
        }

        BigDecimal producible = materials.stream()
                .map(pm -> pm.getRawMaterial().getStockQuantity()
                        .divide(pm.getRequiredQuantity(), 4, RoundingMode.FLOOR))
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        return new ProductionCapacityResponse(
                product.getId(),
                product.getName(),
                producible.setScale(0, RoundingMode.FLOOR),
                details
        );
    }
}
