package com.autoflex.challenge.rawmaterial;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class RawMaterialService {

    @Inject
    RawMaterialRepository rawMaterialRepository;

    public List<RawMaterialResponse> listAll() {
        return rawMaterialRepository.listAll()
                .stream()
                .map(RawMaterialResponse::from)
                .toList();
    }

    public RawMaterialResponse findById(Long id) {
        RawMaterial rawMaterial = rawMaterialRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Raw material not found: " + id));
        return RawMaterialResponse.from(rawMaterial);
    }

    @Transactional
    public RawMaterialResponse create(RawMaterialRequest request) {
        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.setName(request.getName());
        rawMaterial.setDescription(request.getDescription());
        rawMaterial.setStockQuantity(request.getStockQuantity());
        rawMaterial.setUnit(request.getUnit());
        rawMaterialRepository.persist(rawMaterial);
        return RawMaterialResponse.from(rawMaterial);
    }

    @Transactional
    public RawMaterialResponse update(Long id, RawMaterialRequest request) {
        RawMaterial rawMaterial = rawMaterialRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Raw material not found: " + id));
        rawMaterial.setName(request.getName());
        rawMaterial.setDescription(request.getDescription());
        rawMaterial.setStockQuantity(request.getStockQuantity());
        rawMaterial.setUnit(request.getUnit());
        return RawMaterialResponse.from(rawMaterial);
    }

    @Transactional
    public void delete(Long id) {
        if (!rawMaterialRepository.deleteById(id)) {
            throw new NotFoundException("Raw material not found: " + id);
        }
    }

    public RawMaterial getEntityById(Long id) {
        return rawMaterialRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Raw material not found: " + id));
    }
}
