# 📋 دليل إعداد Google Tasks Integration

## ✅ تم إضافة ميزة Google Tasks!

الآن عند كل رسالة جديدة، سيتم:
1. ✅ حفظ البيانات في Google Sheets
2. ✅ إرسال بريد تأكيدي للمرسل
3. ✅ إرسال إشعار لك
4. ✅ تحديث الإحصائيات
5. ✅ **إنشاء مهمة في Google Tasks** 🆕

---

## 🚀 خطوات التفعيل (مهمة جداً!)

### **الخطوة 1: تفعيل Google Tasks API**

**في محرر Apps Script:**

1. انظر للقائمة الجانبية اليسرى
2. ابحث عن **Services** (الخدمات)
3. اضغط على علامة **+** بجانب Services
4. ابحث عن **"Tasks API"** أو **"Google Tasks API"**
5. اضغط **Add**

**يجب أن ترى:**
```
Services
  └── Tasks API v1
```

---

### **الخطوة 2: تحديث الكود**

الكود تم تحديثه بالفعل في `google-apps-script-READY.gs`!

فقط:
1. افتح Apps Script
2. احذف الكود القديم
3. انسخ من `google-apps-script-READY.gs`
4. احفظ (Ctrl+S)

---

### **الخطوة 3: اختبار**

```
1. في Apps Script، اختر: testScript
2. اضغط Run ▶️
3. تحقق من Execution log
```

**يجب أن ترى:**
```
✅ Data saved!
✅ Confirmation email sent
✅ Admin notification sent
✅ Stats updated
✅ Google Task created  ← جديد!
✅ SUCCESS
```

---

### **الخطوة 4: التحقق من المهمة**

**افتح Google Tasks:**
- من Gmail: انظر للجانب الأيمن → أيقونة المهام
- من Google Calendar: نفس الشيء
- من الموبايل: تطبيق Google Tasks

**يجب أن ترى مهمة جديدة:**
```
📬 مراجعة رسالة من: Test User - اختبار
الموضوع: Test Subject - موضوع اختبار
تمت الإضافة تلقائياً من نموذج الاتصال في الموقع.
التاريخ: [التاريخ والوقت]

⏰ الاستحقاق: غداً (بعد 24 ساعة)
```

---

## 🎯 المميزات:

### **1. إنشاء تلقائي:**
- عند كل رسالة جديدة، تُنشأ مهمة تلقائياً
- لا تحتاج لفعل أي شيء يدوياً

### **2. تفاصيل كاملة:**
- اسم المرسل
- موضوع الرسالة
- تاريخ ووقت الاستلام

### **3. تذكير ذكي:**
- تاريخ استحقاق بعد 24 ساعة
- سيذكرك Google بالرد على الرسالة

### **4. تكامل كامل:**
- تظهر في Gmail
- تظهر في Google Calendar
- تظهر في تطبيق Google Tasks على الموبايل

---

## ⚙️ التخصيص:

### **تغيير وقت الاستحقاق:**

في السطر 274 من الكود:
```javascript
// بعد 24 ساعة (حالياً)
due: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

// بعد 48 ساعة
due: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

// بعد أسبوع
due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

// بدون تاريخ استحقاق (احذف السطر)
```

### **تغيير القائمة:**

```javascript
// القائمة الرئيسية (حالياً)
Tasks.Tasks.insert(newTask, "@default");

// قائمة مخصصة (يجب إنشاؤها أولاً)
// احصل على ID القائمة من Google Tasks
Tasks.Tasks.insert(newTask, "قائمة_ID_هنا");
```

### **تغيير عنوان المهمة:**

```javascript
var taskTitle = "📬 مراجعة رسالة من: " + name;
// غيّر إلى:
var taskTitle = "🔔 رسالة جديدة: " + subject;
// أو:
var taskTitle = "رد مطلوب من: " + name + " - " + subject;
```

---

## 🔍 استكشاف الأخطاء:

### **❌ خطأ: "Tasks is not defined"**

**السبب:** لم يتم تفعيل Google Tasks API

**الحل:**
1. Services → + → Tasks API → Add
2. احفظ الكود مرة أخرى
3. جرب مرة أخرى

---

### **❌ خطأ: "Permission denied"**

**السبب:** لم يتم منح صلاحيات Tasks

**الحل:**
1. Run → testScript
2. Review Permissions
3. Allow

---

### **✅ المهمة لا تظهر في Tasks**

**تحقق من:**
1. Execution log - هل ظهر "✅ Google Task created"?
2. افتح Google Tasks وحدّث الصفحة
3. تأكد من أنك تنظر للقائمة الصحيحة (@default)

---

## 📱 استخدام متقدم:

### **إضافة أولوية:**

Google Tasks لا يدعم الأولوية مباشرة، لكن يمكنك:
```javascript
var taskTitle = "🔴 [عاجل] مراجعة رسالة من: " + name;
// أو
var taskTitle = "🟡 [متوسط] مراجعة رسالة من: " + name;
```

### **إضافة رابط مباشر:**

```javascript
var taskNotes = "الموضوع: " + subject + "\n" +
                "البريد: " + email + "\n" +
                "الرابط: https://docs.google.com/spreadsheets/d/" + 
                SpreadsheetApp.getActiveSpreadsheet().getId();
```

---

## 🎉 الفوائد:

1. **لن تنسى الرد** - تذكير تلقائي
2. **تنظيم أفضل** - كل رسالة = مهمة
3. **تتبع سهل** - علّم المهمة كمكتملة بعد الرد
4. **تكامل كامل** - مع Gmail و Calendar

---

## 📊 الإحصائيات:

يمكنك لاحقاً إضافة:
- عدد المهام المكتملة
- معدل وقت الاستجابة
- المهام المتأخرة

---

**الآن النظام متكامل بالكامل!** 🚀

**الخطوة التالية:**
1. ✅ فعّل Google Tasks API
2. ✅ حدّث الكود في Apps Script
3. ✅ اختبر بـ testScript
4. ✅ تحقق من Google Tasks
