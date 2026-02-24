// Desenvolvido por Paulo Dias - Autoflex Challenge 2026
package com.autoflex.challenge.capacity;

import java.math.BigDecimal;
import java.util.List;

public class ProductionCapacityResponse {

    private Long productId;
    private String productName;
    private BigDecimal producibleQuantity;
    private List<MaterialDetail> materials;

    public ProductionCapacityResponse(Long productId, String productName, BigDecimal producibleQuantity, List<MaterialDetail> materials) {
        this.productId = productId;
        this.productName = productName;
        this.producibleQuantity = producibleQuantity;
        this.materials = materials;
    }

    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public BigDecimal getProducibleQuantity() { return producibleQuantity; }
    public List<MaterialDetail> getMaterials() { return materials; }

    public static class MaterialDetail {
        private String name;
        private String unit;
        private BigDecimal requiredQuantity;
        private BigDecimal availableStock;

        public MaterialDetail(String name, String unit, BigDecimal requiredQuantity, BigDecimal availableStock) {
            this.name = name;
            this.unit = unit;
            this.requiredQuantity = requiredQuantity;
            this.availableStock = availableStock;
        }

        public String getName() { return name; }
        public String getUnit() { return unit; }
        public BigDecimal getRequiredQuantity() { return requiredQuantity; }
        public BigDecimal getAvailableStock() { return availableStock; }
    }
}
