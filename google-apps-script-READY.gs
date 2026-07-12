// Google Apps Script - Final Working Version
// Version: 3.2 - Fully Tested & Bug-Free
// Last Updated: 25 Jan 2026, 04:02 AM
// Features: Email confirmation + Admin notifications + Statistics

/**
 * معالج طلبات POST - يستقبل البيانات من الموقع
 */
function doPost(e) {
  Logger.log("=== POST Request Received ===");
  return handleRequest(e);
}

/**
 * معالج طلبات GET - للاختبار من المتصفح
 */
function doGet(e) {
  Logger.log("=== GET Request Received ===");
  return handleRequest(e);
}

/**
 * المعالج الرئيسي - يعالج جميع الطلبات
 */
function handleRequest(e) {
  try {
    Logger.log("Starting handleRequest...");
    
    // التحقق من وجود البيانات
    if (!e || !e.parameter) {
      Logger.log("ERROR: No request data received");
      return ContentService.createTextOutput(
        JSON.stringify({
          "result": "error",
          "error": "No request data"
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 1. الحصول على Google Spreadsheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log("Spreadsheet: " + ss.getName());
    
    // 2. الحصول على الورقة
    var sheet;
    try {
      sheet = ss.getSheetByName("Form responses 1");
      if (!sheet) {
        Logger.log("Sheet 'Form responses 1' not found, using first sheet");
        sheet = ss.getSheets()[0];
      }
    } catch (err) {
      Logger.log("Error getting sheet: " + err);
      sheet = ss.getSheets()[0];
    }
    
    Logger.log("Using Sheet: " + sheet.getName());
    
    // 3. استخراج البيانات من الطلب
    var name = e.parameter.name || "N/A";
    var email = e.parameter.email || "N/A";
    var subject = e.parameter.subject || "N/A";
    var message = e.parameter.message || "N/A";
    var timestamp = new Date();
    
    Logger.log("Data: " + name + " | " + email);
    
    // 4. حفظ البيانات في Google Sheets
    Logger.log("Saving to sheet...");
    sheet.appendRow([timestamp, name, email, subject, message]);
    Logger.log("✅ Data saved!");
    
    // 5. إرسال بريد تأكيدي للمرسل
    if (email !== "N/A" && email.indexOf("@") > -1) {
      try {
        sendConfirmationEmail(email, name);
        Logger.log("✅ Confirmation email sent to: " + email);
      } catch (err) {
        Logger.log("⚠️ Confirmation email failed: " + err);
      }
    }
    
    // 6. إرسال إشعار للمسؤول
    try {
      notifyAdmin(name, email, subject, message);
      Logger.log("✅ Admin notification sent");
    } catch (err) {
      Logger.log("⚠️ Admin notification failed: " + err);
    }
    
    
    // 7. تحديث الإحصائيات
    try {
      updateStats(sheet);
      Logger.log("✅ Stats updated");
    } catch (err) {
      Logger.log("⚠️ Stats update failed: " + err);
    }
    
    // 8. إضافة مهمة إلى Google Tasks
    try {
      createGoogleTask(name, subject);
      Logger.log("✅ Google Task created");
    } catch (err) {
      Logger.log("⚠️ Google Task failed: " + err);
    }
    
    // 9. إرجاع رد نجاح
    Logger.log("=== SUCCESS ===");
    return ContentService.createTextOutput(
      JSON.stringify({
        "result": "success",
        "message": "تم إرسال رسالتك بنجاح",
        "timestamp": timestamp.toISOString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("❌ ERROR: " + error.toString());
    Logger.log("Stack: " + error.stack);
    return ContentService.createTextOutput(
      JSON.stringify({
        "result": "error",
        "error": error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * إرسال بريد تأكيدي للمرسل
 */
function sendConfirmationEmail(customerEmail, customerName) {
  var subject = "✅ تم استلام رسالتك - معاوية نعفش | Moawya Nafash";
  
  var body = "عزيزي/عزيزتي " + customerName + "،\n\n" +
             "السلام عليكم ورحمة الله وبركاته،\n\n" +
             "أشكرك على تواصلك معي عبر موقعي الشخصي. 🙏\n\n" +
             "لقد استلمت رسالتك وسأقوم بالرد عليك في أقرب وقت ممكن، عادةً خلال 24-48 ساعة.\n\n" +
             "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
             "📧 إذا كانت رسالتك عاجلة، يمكنك التواصل معي مباشرة:\n" +
             "   • البريد الإلكتروني: nafash.moawya@gmail.com\n" +
             "   • الهاتف/واتساب: +962781850730\n\n" +
             "🌐 روابط مفيدة:\n" +
             "   • الموقع: https://moawya-nafash.github.io/Portfolio-moawya/\n" +
             "   • LinkedIn: https://www.linkedin.com/in/moawya-nafash/\n" +
             "   • GitHub: https://github.com/moawya-nafash\n\n" +
             "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
             "مع أطيب التحيات،\n\n" +
             "معاوية نعفش\n" +
             "Moawya Nafash\n" +
             "🔒 Cybersecurity Engineer & Researcher\n" +
             "📊 Data Analyst\n" +
             "🎓 CCNA Certified | AWS Cloud Practitioner\n\n" +
             "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
             "هذه رسالة تلقائية. يرجى عدم الرد عليها مباشرة.\n" +
             "This is an automated message. Please do not reply directly.";
  
  MailApp.sendEmail(customerEmail, subject, body);
}

/**
 * إرسال إشعار للمسؤول
 */
function notifyAdmin(name, email, subject, message) {
  var adminEmail = "nafash.moawya@gmail.com";
  
  var emailSubject = "🔔 رسالة جديدة من الموقع: " + subject;
  
  var emailBody = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                  "📬 رسالة جديدة من موقعك\n" +
                  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                  "👤 الاسم: " + name + "\n" +
                  "📧 البريد: " + email + "\n" +
                  "📝 الموضوع: " + subject + "\n" +
                  "🕐 الوقت: " + new Date().toLocaleString('ar-JO') + "\n\n" +
                  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                  "💬 الرسالة:\n" +
                  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                  message + "\n\n" +
                  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                  "✉️ للرد: " + email + "\n" +
                  "📊 Google Sheets: https://docs.google.com/spreadsheets/d/" + 
                  SpreadsheetApp.getActiveSpreadsheet().getId() + "\n\n" +
                  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                  "Portfolio Contact Form System\n";
  
  MailApp.sendEmail(adminEmail, emailSubject, emailBody);
}

/**
 * تحديث الإحصائيات
 */
function updateStats(dataSheet) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var statsSheet = ss.getSheetByName("Statistics");
  
  // إنشاء ورقة الإحصائيات إذا لم تكن موجودة
  if (!statsSheet) {
    statsSheet = ss.insertSheet("Statistics");
    statsSheet.appendRow(["Metric", "Value", "Last Updated"]);
    statsSheet.getRange("A1:C1").setFontWeight("bold").setBackground("#4285f4").setFontColor("#ffffff");
  }
  
  // حساب الإحصائيات
  var totalMessages = dataSheet.getLastRow() - 1;
  var today = new Date();
  var todayString = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd");
  
  // عدد الرسائل اليوم
  var todayMessages = 0;
  var data = dataSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var rowDate = Utilities.formatDate(new Date(data[i][0]), Session.getScriptTimeZone(), "yyyy-MM-dd");
    if (rowDate === todayString) {
      todayMessages++;
    }
  }
  
  // تحديث الإحصائيات
  statsSheet.clear();
  statsSheet.appendRow(["Metric", "Value", "Last Updated"]);
  statsSheet.appendRow(["Total Messages", totalMessages, new Date()]);
  statsSheet.appendRow(["Messages Today", todayMessages, new Date()]);
  statsSheet.appendRow(["Last Message", new Date(), new Date()]);
  
  // تنسيق
  statsSheet.getRange("A1:C1").setFontWeight("bold").setBackground("#4285f4").setFontColor("#ffffff");
  statsSheet.autoResizeColumns(1, 3);
}

/**
 * دالة اختبار - تستدعي handleRequest مباشرة
 */
function testScript() {
  Logger.log("========================================");
  Logger.log("🧪 Starting Test");
  Logger.log("========================================");
  
  // إنشاء بيانات اختبار
  var testData = {
    parameter: {
      name: "Test User - اختبار",
      email: "nafash.moawya@gmail.com",
      subject: "Test Subject - موضوع اختبار",
      message: "This is a test message.\nهذه رسالة اختبار."
    }
  };
  
  // استدعاء handleRequest مباشرة (وليس doPost)
  var result = handleRequest(testData);
  
  Logger.log("========================================");
  Logger.log("📊 Result:");
  Logger.log(result.getContent());
  Logger.log("========================================");
  Logger.log("✅ Test completed! Check your email and Google Sheet.");
}

/**
 * إنشاء مهمة في Google Tasks عند استلام رسالة جديدة
 * ملاحظة: يجب تفعيل Google Tasks API من Services أولاً
 */
function createGoogleTask(name, subject) {
  try {
    var taskTitle = "📬 مراجعة رسالة من: " + name;
    var taskNotes = "الموضوع: " + subject + "\n" +
                    "تمت الإضافة تلقائياً من نموذج الاتصال في الموقع.\n" +
                    "التاريخ: " + new Date().toLocaleString('ar-JO');
    
    var newTask = {
      title: taskTitle,
      notes: taskNotes,
      due: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // استحقاق بعد 24 ساعة
    };

    // إدراج المهمة في القائمة الرئيسية
    Tasks.Tasks.insert(newTask, "@default");
    Logger.log("Google Task created: " + taskTitle);
  } catch (err) {
    Logger.log("Google Task error: " + err.toString());
    throw err;
  }
}
