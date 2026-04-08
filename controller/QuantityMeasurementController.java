package com.app.quantitymeasurement.controller;

import com.app.quantitymeasurement.model.QuantityInputDTO;
import com.app.quantitymeasurement.model.QuantityMeasurementDTO;
import com.app.quantitymeasurement.service.IQuantityMeasurementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/v1/quantities")
@CrossOrigin(origins = "http://localhost:3000") // ✅ REQUIRED
@Tag(
    name = "Quantity Measurements",
    description = "REST API for quantity measurement operations"
)
public class QuantityMeasurementController {

    private static final Logger logger =
            Logger.getLogger(QuantityMeasurementController.class.getName());

    @Autowired
    private IQuantityMeasurementService service;

    @PostMapping("/compare")
    @Operation(summary = "Compare two quantities")
    public ResponseEntity<QuantityMeasurementDTO> performComparison(
            @Valid @RequestBody QuantityInputDTO input) {

        QuantityMeasurementDTO result = service.compare(
                input.getThisQuantityDTO(),
                input.getThatQuantityDTO());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/convert")
    @Operation(summary = "Convert quantity to target unit")
    public ResponseEntity<QuantityMeasurementDTO> performConversion(
            @Valid @RequestBody QuantityInputDTO input) {

        QuantityMeasurementDTO result = service.convert(
                input.getThisQuantityDTO(),
                input.getThatQuantityDTO());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/add")
    public ResponseEntity<QuantityMeasurementDTO> performAddition(
            @Valid @RequestBody QuantityInputDTO input) {

        QuantityMeasurementDTO result = service.add(
                input.getThisQuantityDTO(),
                input.getThatQuantityDTO());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/subtract")
    public ResponseEntity<QuantityMeasurementDTO> performSubtraction(
            @Valid @RequestBody QuantityInputDTO input) {

        QuantityMeasurementDTO result = service.subtract(
                input.getThisQuantityDTO(),
                input.getThatQuantityDTO());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/divide")
    public ResponseEntity<QuantityMeasurementDTO> performDivision(
            @Valid @RequestBody QuantityInputDTO input) {

        QuantityMeasurementDTO result = service.divide(
                input.getThisQuantityDTO(),
                input.getThatQuantityDTO());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history/operation/{operation}")
    public ResponseEntity<List<QuantityMeasurementDTO>> getOperationHistory(
            @PathVariable String operation) {

        return ResponseEntity.ok(service.getOperationHistory(operation));
    }

    @GetMapping("/history/type/{type}")
    public ResponseEntity<List<QuantityMeasurementDTO>> getOperationHistoryByType(
            @PathVariable String type) {

        return ResponseEntity.ok(service.getMeasurementsByType(type));
    }

    @GetMapping("/count/{operation}")
    public ResponseEntity<Long> getOperationCount(
            @PathVariable String operation) {

        return ResponseEntity.ok(service.getOperationCount(operation));
    }

    @GetMapping("/history/errored")
    public ResponseEntity<List<QuantityMeasurementDTO>> getErroredOperations() {
        return ResponseEntity.ok(service.getErrorHistory());
    }
}