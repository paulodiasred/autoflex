package com.autoflex.challenge.productmaterial;

import com.autoflex.challenge.product.Product;
import com.autoflex.challenge.product.ProductRepository;
import com.autoflex.challenge.rawmaterial.RawMaterial;
import com.autoflex.challenge.rawmaterial.RawMaterialRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class ProductMaterialService {

    @Inject
    ProductMaterialRepository productMaterialRepository;

    @Inject
    ProductRepository productRepository;

    @Inject
    RawMaterialRepository rawMaterialRepository;

    public List<ProductMaterialResponse> listByProduct(Long productId) {
        assertProductExists(productId);
        return productMaterialRepository.findByProductId(productId)
                .stream()
                .map(ProductMaterialResponse::from)
                .toList();
    }

    @Transactional
    public ProductMaterialResponse add(Long productId, ProductMaterialRequest request) {
        Product product = productRepository.findByIdOptional(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: " + productId));
        RawMaterial rawMaterial = rawMaterialRepository.findByIdOptional(request.getRawMaterialId())
                .orElseThrow(() -> new NotFoundException("Raw material not found: " + request.getRawMaterialId()));

        ProductMaterial pm = new ProductMaterial();
        pm.setProduct(product);
        pm.setRawMaterial(rawMaterial);
        pm.setRequiredQuantity(request.getRequiredQuantity());
        productMaterialRepository.persist(pm);
        return ProductMaterialResponse.from(pm);
    }

    @Transactional
    public ProductMaterialResponse update(Long productId, Long associationId, ProductMaterialRequest request) {
        assertProductExists(productId);
        ProductMaterial pm = productMaterialRepository.findByIdOptional(associationId)
                .filter(a -> a.getProduct().getId().equals(productId))
                .orElseThrow(() -> new NotFoundException("Association not found: " + associationId));
        RawMaterial rawMaterial = rawMaterialRepository.findByIdOptional(request.getRawMaterialId())
                .orElseThrow(() -> new NotFoundException("Raw material not found: " + request.getRawMaterialId()));

        pm.setRawMaterial(rawMaterial);
        pm.setRequiredQuantity(request.getRequiredQuantity());
        return ProductMaterialResponse.from(pm);
    }

    @Transactional
    public void delete(Long productId, Long associationId) {
        assertProductExists(productId);
        ProductMaterial pm = productMaterialRepository.findByIdOptional(associationId)
                .filter(a -> a.getProduct().getId().equals(productId))
                .orElseThrow(() -> new NotFoundException("Association not found: " + associationId));
        productMaterialRepository.delete(pm);
    }

    private void assertProductExists(Long productId) {
        if (productRepository.findByIdOptional(productId).isEmpty()) {
            throw new NotFoundException("Product not found: " + productId);
        }
    }
}
