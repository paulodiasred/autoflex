package com.autoflex.challenge.productmaterial;

import java.math.BigDecimal;

public class ProductMaterialResponse {

    private Long id;
    private Long rawMaterialId;
    private String rawMaterialName;
    private String rawMaterialUnit;
    private BigDecimal requiredQuantity;

    public static ProductMaterialResponse from(ProductMaterial pm) {
        ProductMaterialResponse response = new ProductMaterialResponse();
        response.id = pm.getId();
        response.rawMaterialId = pm.getRawMaterial().getId();
        response.rawMaterialName = pm.getRawMaterial().getName();
        response.rawMaterialUnit = pm.getRawMaterial().getUnit();
        response.requiredQuantity = pm.getRequiredQuantity();
        return response;
    }

    public Long getId() { return id; }
    public Long getRawMaterialId() { return rawMaterialId; }
    public String getRawMaterialName() { return rawMaterialName; }
    public String getRawMaterialUnit() { return rawMaterialUnit; }
    public BigDecimal getRequiredQuantity() { return requiredQuantity; }
}
