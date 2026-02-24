package com.autoflex.challenge.rawmaterial;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Raw Materials")
public class RawMaterialResource {

    @Inject
    RawMaterialService rawMaterialService;

    @GET
    @Operation(summary = "List all raw materials")
    public List<RawMaterialResponse> listAll() {
        return rawMaterialService.listAll();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get raw material by id")
    public RawMaterialResponse findById(@PathParam("id") Long id) {
        return rawMaterialService.findById(id);
    }

    @POST
    @Operation(summary = "Create a new raw material")
    public Response create(@Valid RawMaterialRequest request) {
        RawMaterialResponse response = rawMaterialService.create(request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update a raw material")
    public RawMaterialResponse update(@PathParam("id") Long id, @Valid RawMaterialRequest request) {
        return rawMaterialService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete a raw material")
    public Response delete(@PathParam("id") Long id) {
        rawMaterialService.delete(id);
        return Response.noContent().build();
    }
}
