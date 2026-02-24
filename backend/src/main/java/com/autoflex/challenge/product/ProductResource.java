// Desenvolvido por Paulo Dias - Autoflex Challenge 2026
package com.autoflex.challenge.product;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Products")
public class ProductResource {

    @Inject
    ProductService productService;

    @GET
    @Operation(summary = "List all products")
    public List<ProductResponse> listAll() {
        return productService.listAll();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get product by id")
    public ProductResponse findById(@PathParam("id") Long id) {
        return productService.findById(id);
    }

    @POST
    @Operation(summary = "Create a new product")
    public Response create(@Valid ProductRequest request) {
        ProductResponse response = productService.create(request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update a product")
    public ProductResponse update(@PathParam("id") Long id, @Valid ProductRequest request) {
        return productService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete a product")
    public Response delete(@PathParam("id") Long id) {
        productService.delete(id);
        return Response.noContent().build();
    }
}
