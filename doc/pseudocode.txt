
// Input Phase
FUNCTION piorityChecker()
    BEGIN FUNCTION
    RECEIVE MachineCondition FROM (STRING) KEYBOARD
    RECEIVE DaysSinceService FROM (INTEGER) KEYBOARD
    RECEIVE InUse FROM (STRING) KEYBOARD

    // Validation Phase
    SET IsValid TO TRUE
    SET ErrorMessage TO ''

    IF MachineCondition <> 'Good' AND MachineCondition <> 'Worn' AND MachineCondition <> 'Critical' THEN
        SET IsValid TO FALSE
        SET ErrorMessage TO 'Invalid machine condition entered.'
    END IF

    IF DaysSinceService < 0 THEN
        SET IsValid TO FALSE
        SET ErrorMessage TO 'Days since service cannot be negative.'
    END IF

    // Processing Phase
    IF IsValid = FALSE THEN
        SEND ErrorMessage TO DISPLAY
    ELSE
        SET Priority TO ''
        
        // Priority Logic based on rules
        IF MachineCondition = 'Critical' OR DaysSinceService >= 60 THEN
            SET Priority TO 'High'
        ELSE
            IF MachineCondition = 'Worn' OR (DaysSinceService >= 30 AND DaysSinceService <= 59) THEN
                SET Priority TO 'Medium'
            ELSE
                // Low priority if Good AND days < 30
                SET Priority TO 'Low'
            END IF
        END IF

        // Output Formatting
        SET FinalMessage TO 'Maintenance Priority: ' & Priority
        
        // Check for "In Use" warning
        IF InUse = 'Yes' THEN
            SET FinalMessage TO FinalMessage & ' - WARNING: Machine is currently in use!'
        END IF

        SEND FinalMessage TO DISPLAY
    END IF
END FUNCTION




function priority_checker() {
    const conditionEl = document.getElementById('machineCondition');
    const daysEl = document.getElementById('daysSinceService');
    const inUseEl = document.getElementById('inUse');
    const outputEl = document.getElementById('output');

    if (!conditionEl || !daysEl || !inUseE   !outputEl) {
        console.error('Missing one or more required elements: #machineCondition, #daysSinceService, #inUse, #output');
        return;
    }

    const MachineCondition = String(conditionEl.value).trim(); // "Good" | "Worn" | "Critical"
    const DaysSinceService = Number(daysEl.value);             // number
    const InUse = String(inUseEl.value).trim();                // "Yes" | "No" (anything else won't trigger warning)

    const message = evaluatePriority(MachineCondition, DaysSinceService, InUse);
    outputEl.innerText = message;
}


