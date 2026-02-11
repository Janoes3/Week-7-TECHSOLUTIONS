FUNCTION MaintenanceCondition()
    BEGIN FUNCTION
    SET number TO 0
    SET machineUse TO ''

    IF machineCondition IS 





FUNCTION priority_checker
BEGIN FUNCTION

    RECEIVE condition FROM DROPDOWN
    RECEIVE days_last_service FROM KEYBOARD
    RECEIVE in_use FROM DROPDOWN

    IF condition IS EMPTY THEN
        SEND "Error: Machine condition must be selected." TO DISPLAY
        STOP
    ENDIF

    IF days_last_service < 0 THEN
        SEND "Error: Days since last service must be 0 or more." TO DISPLAY
        STOP
    ENDIF

    IF in_use IS EMPTY THEN
        SEND "Error: Machine usage status must be selected." TO DISPLAY
        STOP
    ENDIF

    IF condition = "Critical" OR days_last_service >= 60 THEN
        SET priority TO "High priority"
        SET explanation TO "Immediate maintenance required."
    ELSE IF condition = "Worn" OR (days_last_service >= 30 AND days_last_service <= 59) THEN
        SET priority TO "Medium priority"
        SET explanation TO "Maintenance should be scheduled soon."
    ELSE IF condition = "Good" AND days_last_service < 30 THEN
        SET priority TO "Low priority"
        SET explanation TO "No urgent maintenance needed."
    ENDIF

    SET output_message TO priority + " - " + explanation

    IF in_use = "Yes" THEN
        SET output_message TO output_message + 
        " WARNING: Machine is currently in use."
    ENDIF

    SEND output_message TO DISPLAY

END FUNCTION


function priority_checker() {
    // Read inputs from the page
    const condition = document.getElementById("condition").value;
    const daysLastService = Number(document.getElementById("days_last_service").value);
    const inUse = document.getElementById("in_use").value;

    let priority = "";
    let explanation = "";
    let outputMessage = "";

    // Validation
    if (condition === "") {
        document.getElementById("output").innerText =
            "Error: Machine condition must be selected.";
        return;
    }

    if (isNaN(daysLastService) || daysLastService < 0) {
        document.getElementById("output").innerText =
            "Error: Days since last service must be 0 or more.";
        return;
    }

    if (inUse === "") {
        document.getElementById("output").innerText =
            "Error: Machine usage status must be selected.";
        return;
    }

    // Priority logic
    if (condition === "Critical" || daysLastService >= 60) {
        priority = "High priority";
        explanation = "Immediate maintenance required.";
    } else if (
        condition === "Worn" ||
        (daysLastService >= 30 && daysLastService <= 59)
    ) {
        priority = "Medium priority";
        explanation = "Maintenance should be scheduled soon.";
    } else if (condition === "Good" && daysLastService < 30) {
        priority = "Low priority";
        explanation = "No urgent maintenance needed.";
    }

    // Build output message
    outputMessage = priority + " - " + explanation;

    if (inUse === "Yes") {
        outputMessage += " WARNING: Machine is currently in use.";
    }

    // Display result
    document.getElementById("output").innerText = outputMessage;
}



## times 2 numbers together 

SET number_1 to 0
SET number_2 to 0 

SEND 'Enter first number' to DISPLAY
RECIEVE number_1 FROM KEYBOARD

SEND 'Enter second number' TO DISPLAY
RECIEVE number_2 FROM KEYBOARD


## New Customer Form 
FUNCTION new_customer_form ():
    BEGIN FUNCTION
    SET name TO ""
    SET surname TO ""
    SET date_of_birth TO ""


    WHILE name = '' DO
        SEND 'Enter name' TO DISPLAY
        RECIEVE name FROM (STRING) KEYBOARD
    ENDWHILE 

    WHILE surname == "" DO
        SEND "Enter surname" TO DISPLAY
        RECIEVE surname FROM (STRING) KEYBOARD
    ENDWHILE

    WHILE date_of_birth = "" OR date_of_birth >= today() DO
        SEND "Enter a valid date of birth" TO DISPLAY
        RECIEVE date_of_birth FROM (DATETIME) KEYBOARD
    ENDWHILE

    RETURN "Customer added"
ENDFUNCTION


FUNCTION stocklevel()
    BEGIN FUNCTION
    SET number TO 0
    WHILE number = 0 DO
        SEND "Please enter a stock level number" TO DISPLAY
        RECIEVE number FROM KEYBOARD
 
        IF number > 20 THEN
            SEND "High stock" TO DISPLAY
        ELSE IF 6 > number < 20 THEN
            SEND "Stock OK" TO DISPLAY
        ELSE IF 1 > number < 5 THEN
            SEND "Low Stock" TO DISPLAY
        ELSE IF number = 0 THEN
            SEND "Out of stock" TO DISPLAY        
        ELSE
            SEND 'Number is invalid' TO DISPLAY
        ENDIF
    END WHILE
END FUNCTION


FUNCTION maintenanceChecker()
    BEGIN FUNCTION 

    SEND 'Enter days since last service:' TO DISPLAY
    RECEIVE daysSinceLastService FROM (INTEGER) KEYBOARD

    SEND 'Enter service frequency (weekly or monthly):' TO DISPLAY
    RECEIVE serviceFrequency FROM (STRING) KEYBOARD

    SET OutputMessage TO ''       
    SET isValid TO TRUE            


    IF daysSinceLastService < 0 THEN
        SET OutputMessage TO 'Error: daysSinceLastService must be 0 or more.'
        SET isValid TO FALSE
    END IF

    IF isValid = TRUE THEN
        IF serviceFrequency NOT 'weekly' AND serviceFrequency NOT 'monthly' THEN
            SET OutputMessage TO 'Error: serviceFrequency must be either "weekly" or "monthly".'
            SET isValid TO FALSE
        END IF
    END IF

    // --- Core decision logic (only runs if inputs are valid) ---
    IF isValid = TRUE THEN

        // Weekly rules: due at 7, due soon at 5 or 6
        IF serviceFrequency = 'weekly' THEN
            IF daysSinceLastService >= 7 THEN
                SET OutputMessage TO 'Due now'
            ELSE
                IF daysSinceLastService = 5 OR daysSinceLastService = 6 THEN
                    SET OutputMessage TO 'Due soon'
                ELSE
                    SET OutputMessage TO 'Not due yet'
                END IF
            END IF
        END IF

        // Monthly rules: due at 30, due soon at 28 or 29
        IF serviceFrequency = 'monthly' THEN
            IF daysSinceLastService >= 30 THEN
                SET OutputMessage TO 'Due now'
            ELSE
                IF daysSinceLastService = 28 OR daysSinceLastService = 29 THEN
                    SET OutputMessage TO 'Due soon'
                ELSE
                    SET OutputMessage TO 'Not due yet'
                END IF
            END IF
        END IF

    END IF
    RETURN OutputMessage

END FUNCTION 




//TASK ONE: USERNAME CHECK FUNCTION 
Username_check() 
    BEGIN FUNCTION

    SET User TO ""
    WHILE User is "" DO
        SEND "please enter your User:" TO DISPLAY
        RECIEVE User FROM (string) KEYBOARD
    ENDWHILE

    SET user_len TO User.LENGTH()

    WHILE user_len is < 4 OR user_len > 12 DO
        send "Username should be between 4 and 12 characters:" TO DISPLAY
        RECIEVE User FROM (string) KEYBOARD
    ENDWHILE
    RETURN User & 'is valid'
ENDFUNCTION

//ALTERNATIVE APPROACH

FUNCTION username_checker() 
    BEGIN FUNCTION
    SET flag TO True 
    WHILE flag = True DO 
        SET username = RECIEVE username FROM(STRING) KEYBOARD 
        IF 3 < LEN(username) < 13 DO 
        RETURN "Username accepted " TO DISPLAY 
        SET flag TO False 
    ENDWHILE 
        ELSE: SEND "The length of username should be between 4-12 characters" TO DISPLAY 
    ENDFUNCTION

//TASK TWO: STOCK LEVEL ALERT 
FUNCTION stock_level() 
    BEGIN FUNCTION 
    SET stock_level TO -1

    WHILE stock_level < 0 DO
        RECEIVE stock_level FROM (INTEGER) KEYBOARD
        IF stock > 20 THEN
            SEND 'High stock' TO DISPLAY
        ELSE IF stock > 5 THEN
            SEND 'Stock OK' TO DISPLAY
        ELISE IF stock > 0 THEN
            SEND 'Low stock' TO DISPLAY
        ELSE IF stock = 0 THEN
            SEND 'Out of stock' TO DISPLAY
        ELSE
            SEND 'Invalid response'
        ENDIF
    RETURN 'Stock level checked'
    ENDWHILE
ENDFUNCTION

//TASK THREE: MAINTENANCE CHECKER
FUNCTION maintenance() 
    BEGIN FUNCTION 
    SET daysSinceLastService TO RECIEVE days FROM(INTEGER)KEYBOARD

    WHILE daysSinceLastService NOT number DO
        SEND "Please enter a number"
        SET daysSinceLastService TO RECIEVE days FROM(INTEGER)KEYBOARD
    ENDWHILE

    WHILE daysSinceLastService < 0 DO
        SEND "The number must be 0 or more!"
        SET daysSinceLastService TO RECIEVE days FROM(INTEGER)KEYBOARD
    ENDWHILE

    SET serviceFrequency TO ""
    SEND "Please choose an option for you service frequency: 1.Weekly  2.Monthly" TO DISPLAY
    SET frequency TO RECIEVE frequency FROM(INTEGER) FROM KEYBOARD

    IF frequency = 1 THEN
        SET serviceFrequency TO 7
    ELSE IF frequency = 2 THEN
        SET serviceFrequency TO 30
    ELSE 
        SEND "Sorry you did not enter a valid option " TO DISPLAY
    ENDIF

    SET daysleft TO serviceFrequency - daysSinceLastService
    IF daysleft IN [1,2] THEN
        SEND "Due soon" TO DISPLAY
    ELSE IF daysleft > 2 THEN
        SEND "Not due yet" TO DISPLAY
    ELSE IF daysleft = 0 THEN
        SEND "Due now" TO DISPLAY
    ELSE IF daysleft<1 DO
        SEND "You are late for the service"
    ELSE 
        SEND "There was a problem"

    RETURN "Service day function complete"
ENDFUNCTION

//TASK FOUR: PRIORITY CLASSIFER

FUNCTION priority_checker() 
    BEGIN FUNCTION 
    SET Array_conditions TO ['Good', 'Worn', 'Critical'] 
    SET Array_in_use TO ['Yes', 'No']

    SET condition TO ''
    WHILE condition NOT IN Array_conditions
        SEND 'Enter condition from list' TO DISPLAY
        RECEIVE condition FROM (STRING) KEYBOARD
    ENDWHILE

    SET days_last_service TO -1
    WHILE days_last_service < 0 DO 
        SEND 'Enter days since last service' TO DISPLAY
        RECEIVE days_last_service FROM (INTEGER) KEYBOARD
    ENDWHILE

    SET priority TO ''
    IF condition = 'critical' AND days_last_service > 61 THEN
        SET priority TO 'High'
    ELSE IF condition = 'worn' AND days_last_service > 29 THEN
        SET priority TO 'Medium'
    ELSE IF condition = 'good' AND days_last_service <= 29 THEN
        SET priority TO 'Low'
    ENDIF
    RETURN priority 
ENDFUNCTION

///// The Assignment ////
FUNCTION priority_checker
BEGIN FUNCTION

    RECEIVE condition FROM KEYBOARD
    RECEIVE lastday FROM KEYBOARD
    RECEIVE inuse FROM KEYBOARD

    IF condition NOT IN [1, 2, 3] THEN
        SEND "Error: Machine condition must be selected." TO DISPLAY
        STOP
    ENDIF

    IF lastday < 0 THEN
        SEND "Error: Days since last service must be 0 or more." TO DISPLAY
        STOP
    ENDIF

    IF inuse NOT IN ["yes", "no"] THEN
        SEND "Error: Machine usage status must be Yes or No." TO DISPLAY
        STOP
    ENDIF

    IF condition = 3 OR lastday >= 60 THEN
        SET priority TO "High priority"
        SET explanation TO "Immediate maintenance required."
    ELSE IF condition = 2 OR (lastday >= 30 AND lastday <= 59) THEN
        SET priority TO "Medium priority"
        SET explanation TO "Maintenance should be scheduled soon."
    ELSE IF condition = 1 AND lastday < 30 THEN
        SET priority TO "Low priority"
        SET explanation TO "No urgent maintenance needed."
    ENDIF

    SET output_message TO priority + " - " + explanation

    IF inuse = "yes" THEN
        SET output_message TO output_message + 
        " WARNING: Machine is currently in use."
    ENDIF

    SEND output_message TO DISPLAY

END FUNCTION
