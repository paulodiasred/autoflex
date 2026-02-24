package com.autoflex.challenge.productmaterial;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/products/{productId}/materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Product Materials")
public class ProductMaterialResource {

    @Inject
    ProductMaterialService productMaterialService;

    @GET
    @Operation(summary = "List materials of a product")
    public List<ProductMaterialResponse> listByProduct(@PathParam("productId") Long productId) {
        return productMaterialService.listByProduct(productId);
    }

    @POST
    @Operation(summary = "Add a raw material to a product")
    public Response add(@PathParam("productId") Long productId, @Valid ProductMaterialRequest request) {
        ProductMaterialResponse response = productMaterialService.add(productId, request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @PUT
    @Path("/{associationId}")
    @Operation(summary = "Update a product material association")
    public ProductMaterialResponse update(
            @PathParam("productId") Long productId,
            @PathParam("associationId") Long associationId,
            @Valid ProductMaterialRequest request) {
        return productMaterialService.update(productId, associationId, request);
    }

    @DELETE
    @Path("/{associationId}")
    @Operation(summary = "Remove a raw material from a product")
    public Response delete(
            @PathParam("productId") Long productId,
            @PathParam("associationId") Long associationId) {
        productMaterialService.delete(productId, associationId);
        return Response.noContent().build();
    }
}
