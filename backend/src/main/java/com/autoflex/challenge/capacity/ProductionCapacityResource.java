// Desenvolvido por Paulo Dias - Autoflex Challenge 2026
package com.autoflex.challenge.capacity;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/production-capacity")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Production Capacity")
public class ProductionCapacityResource {

    @Inject
    ProductionCapacityService productionCapacityService;

    @GET
    @Operation(summary = "List products and producible quantities based on current stock")
    public List<ProductionCapacityResponse> calculateAll() {
        return productionCapacityService.calculateAll();
    }
}
