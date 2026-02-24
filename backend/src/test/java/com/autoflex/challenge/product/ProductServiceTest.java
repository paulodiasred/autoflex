package com.autoflex.challenge.product;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
class ProductServiceTest {

    @Inject
    ProductService productService;

    @InjectMock
    ProductRepository productRepository;

    @Test
    void listAll_returnsAllProducts() {
        Product p1 = buildProduct(1L, "Product A", "Desc A");
        Product p2 = buildProduct(2L, "Product B", null);
        when(productRepository.listAll()).thenReturn(List.of(p1, p2));

        List<ProductResponse> result = productService.listAll();

        assertEquals(2, result.size());
        assertEquals("Product A", result.get(0).getName());
        assertEquals("Product B", result.get(1).getName());
    }

    @Test
    void findById_existingId_returnsProduct() {
        Product p = buildProduct(1L, "Product A", "Desc A");
        when(productRepository.findByIdOptional(1L)).thenReturn(Optional.of(p));

        ProductResponse result = productService.findById(1L);

        assertEquals(1L, result.getId());
        assertEquals("Product A", result.getName());
    }

    @Test
    void findById_nonExistingId_throwsNotFoundException() {
        when(productRepository.findByIdOptional(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> productService.findById(99L));
    }

    @Test
    void create_validRequest_persistsAndReturnsProduct() {
        ProductRequest request = new ProductRequest();
        request.setName("New Product");
        request.setDescription("Some description");

        doAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setId(10L);
            return null;
        }).when(productRepository).persist(any(Product.class));

        ProductResponse result = productService.create(request);

        assertEquals("New Product", result.getName());
        assertEquals("Some description", result.getDescription());
        verify(productRepository, times(1)).persist(any(Product.class));
    }

    @Test
    void update_existingId_updatesAndReturnsProduct() {
        Product existing = buildProduct(1L, "Old Name", "Old Desc");
        when(productRepository.findByIdOptional(1L)).thenReturn(Optional.of(existing));

        ProductRequest request = new ProductRequest();
        request.setName("New Name");
        request.setDescription("New Desc");

        ProductResponse result = productService.update(1L, request);

        assertEquals("New Name", result.getName());
        assertEquals("New Desc", result.getDescription());
    }

    @Test
    void update_nonExistingId_throwsNotFoundException() {
        when(productRepository.findByIdOptional(99L)).thenReturn(Optional.empty());

        ProductRequest request = new ProductRequest();
        request.setName("X");

        assertThrows(NotFoundException.class, () -> productService.update(99L, request));
    }

    @Test
    void delete_existingId_deletesSuccessfully() {
        when(productRepository.deleteById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> productService.delete(1L));
        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test
    void delete_nonExistingId_throwsNotFoundException() {
        when(productRepository.deleteById(99L)).thenReturn(false);

        assertThrows(NotFoundException.class, () -> productService.delete(99L));
    }

    private Product buildProduct(Long id, String name, String description) {
        Product p = new Product();
        p.setId(id);
        p.setName(name);
        p.setDescription(description);
        return p;
    }
}
