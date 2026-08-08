package com.scts.dto;

import java.util.ArrayList;
import java.util.List;

public class BulkImportResultDTO {

    private boolean success;
    private String message;
    private int importedCount;
    private int alreadyMemberCount;
    private int skippedCapacityCount;
    private int totalProcessedCount;
    private List<String> warnings = new ArrayList<>();

    public BulkImportResultDTO() {}

    public BulkImportResultDTO(boolean success, String message, int importedCount, int alreadyMemberCount, int skippedCapacityCount, int totalProcessedCount, List<String> warnings) {
        this.success = success;
        this.message = message;
        this.importedCount = importedCount;
        this.alreadyMemberCount = alreadyMemberCount;
        this.skippedCapacityCount = skippedCapacityCount;
        this.totalProcessedCount = totalProcessedCount;
        this.warnings = warnings != null ? warnings : new ArrayList<>();
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getImportedCount() { return importedCount; }
    public void setImportedCount(int importedCount) { this.importedCount = importedCount; }

    public int getAlreadyMemberCount() { return alreadyMemberCount; }
    public void setAlreadyMemberCount(int alreadyMemberCount) { this.alreadyMemberCount = alreadyMemberCount; }

    public int getSkippedCapacityCount() { return skippedCapacityCount; }
    public void setSkippedCapacityCount(int skippedCapacityCount) { this.skippedCapacityCount = skippedCapacityCount; }

    public int getTotalProcessedCount() { return totalProcessedCount; }
    public void setTotalProcessedCount(int totalProcessedCount) { this.totalProcessedCount = totalProcessedCount; }

    public List<String> getWarnings() { return warnings; }
    public void setWarnings(List<String> warnings) { this.warnings = warnings; }

    public void addWarning(String warning) {
        if (this.warnings == null) {
            this.warnings = new ArrayList<>();
        }
        this.warnings.add(warning);
    }
}
