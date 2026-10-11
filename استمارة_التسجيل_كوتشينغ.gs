/**
 * أكاديمية إشراقة وعي الدولية للكوتشينغ
 * إنشاء استمارة التسجيل في التكوين الأساسي في الكوتشينغ
 *
 * طريقة الاستعمال:
 * 1. افتح https://script.google.com وأنشئ مشروعًا جديدًا.
 * 2. الصق هذا الكود كاملًا مكان المحتوى الموجود.
 * 3. (اختياري) ضع معرّف صورة الشعار من Google Drive في LOGO_FILE_ID
 *    ورابط سياسة الخصوصية في PRIVACY_URL.
 * 4. اختر الدالة createCoachingRegistrationForm ثم اضغط «تشغيل» مرة واحدة فقط.
 * 5. وافق على الأذونات، ثم افتح «سجل التنفيذ» لنسخ الروابط.
 */

// معرّف صورة الشعار في Google Drive (اتركه فارغًا إذا لم ترغب في إضافة صورة)
// مثال: من الرابط https://drive.google.com/file/d/ABC123/view يكون المعرّف ABC123
const LOGO_FILE_ID = '';

// رابط سياسة الخصوصية (اتركه فارغًا إذا لم يكن متوفرًا)
const PRIVACY_URL = '';

function createCoachingRegistrationForm() {
  const form = FormApp.create(
    'أكاديمية إشراقة وعي الدولية للكوتشينغ — استمارة التسجيل'
  );

  form.setDescription(
    'التكوين الأساسي في الكوتشينغ\n' +
    'تكوين عن بُعد، موجّه للمبتدئين والمهنيين.\n\n' +
    'ترحب بكم أكاديمية إشراقة وعي الدولية للكوتشينغ. ' +
    'تهدف هذه الاستمارة إلى التعرف على اهتمامكم بالتكوين الأساسي ' +
    'واحتياجاتكم وأهدافكم من المشاركة.\n\n' +
    'الرسوم ومواعيد التكوين ستُحدد لاحقًا، وسيتم التواصل مع المهتمين ' +
    'بشأن التفاصيل.\n\n' +
    'إرسال الاستمارة لا يعني تأكيد التسجيل النهائي.'
  );

  form.setConfirmationMessage(
    'شكرًا لاهتمامكم بالتكوين الأساسي في الكوتشينغ ' +
    'بأكاديمية إشراقة وعي الدولية للكوتشينغ. ' +
    'تم استلام إجاباتكم، وسيتم التواصل معكم بشأن البرنامج ' +
    'ومواعيد التكوين والرسوم وخطوات تأكيد التسجيل.'
  );

  form.setProgressBar(true);
  form.setShuffleQuestions(false);

  // صورة الشعار في أعلى الاستمارة (اختياري)
  if (LOGO_FILE_ID) {
    try {
      const logo = DriveApp.getFileById(LOGO_FILE_ID).getBlob();
      form.addImageItem()
        .setImage(logo)
        .setTitle('أكاديمية إشراقة وعي الدولية للكوتشينغ')
        .setAlignment(FormApp.Alignment.CENTER);
    } catch (e) {
      Logger.log('تعذّر إضافة الشعار، تحقق من LOGO_FILE_ID: ' + e.message);
    }
  }

  // أدوات مساعدة لإنشاء الأسئلة
  function shortAnswer(title, required, help) {
    const item = form.addTextItem()
      .setTitle(title)
      .setRequired(required);
    if (help) item.setHelpText(help);
    return item;
  }

  function paragraph(title, required) {
    return form.addParagraphTextItem()
      .setTitle(title)
      .setRequired(required);
  }

  // other = true يضيف خيار «أخرى» مع خانة لكتابة الإجابة
  function multipleChoice(title, choices, required, other) {
    const item = form.addMultipleChoiceItem()
      .setTitle(title)
      .setChoiceValues(choices)
      .setRequired(required);
    if (other) item.showOtherOption(true);
    return item;
  }

  function checkboxes(title, choices, required, other) {
    const item = form.addCheckboxItem()
      .setTitle(title)
      .setChoiceValues(choices)
      .setRequired(required);
    if (other) item.showOtherOption(true);
    return item;
  }

  // القسم الأول: المعلومات الشخصية
  form.addSectionHeaderItem()
    .setTitle('القسم الأول: المعلومات الشخصية')
    .setHelpText('يرجى إدخال معلومات صحيحة لتسهيل التواصل معكم.');

  shortAnswer('الاسم الكامل', true);

  const email = shortAnswer('البريد الإلكتروني', true);
  email.setValidation(
    FormApp.createTextValidation()
      .requireTextIsEmail()
      .setHelpText('يرجى إدخال بريد إلكتروني صحيح.')
      .build()
  );

  const phone = shortAnswer(
    'رقم الهاتف مع مفتاح الدولة',
    true,
    'مثال: +212 6XX XX XX XX'
  );
  phone.setValidation(
    FormApp.createTextValidation()
      .requireTextMatchesPattern('^\\+?[0-9 ]{8,20}$')
      .setHelpText('يرجى إدخال رقم هاتف صحيح مع مفتاح الدولة، بالأرقام فقط.')
      .build()
  );

  shortAnswer('الدولة', true);
  shortAnswer('المدينة', false);

  // القسم الثاني: المسار الدراسي والمهني
  form.addPageBreakItem()
    .setTitle('القسم الثاني: المسار الدراسي والمهني');

  multipleChoice('المستوى الدراسي', [
    'الثانوي',
    'التعليم الجامعي',
    'الدراسات العليا',
    'التكوين المهني'
  ], true, true);

  multipleChoice('الوضعية المهنية الحالية', [
    'طالب أو متدرب',
    'موظف',
    'مستقل أو صاحب مشروع',
    'كوتش أو ممارس في مجال التنمية الشخصية',
    'التعليم أو التدريب',
    'الصحة النفسية أو مجال المساعدة الإنسانية',
    'أبحث عن مسار مهني جديد'
  ], true, true);

  multipleChoice('هل سبق لكم المشاركة في تكوين في الكوتشينغ؟', [
    'نعم',
    'لا'
  ], true);

  multipleChoice('كيف تصفون معرفتكم الحالية بالكوتشينغ؟', [
    'مبتدئ تمامًا',
    'لدي معرفة نظرية أولية',
    'لدي تجربة أولية',
    'أمارس الكوتشينغ أو أعمل في مجال ذي صلة'
  ], true);

  // القسم الثالث: الدوافع والأهداف
  form.addPageBreakItem()
    .setTitle('القسم الثالث: دوافع التسجيل والأهداف');

  checkboxes('ما دوافعكم للالتحاق بهذا التكوين؟', [
    'تطوير الذات',
    'تحسين التواصل والإصغاء',
    'تعلم طرح الأسئلة الفعالة',
    'تطوير المسار المهني',
    'استخدام المهارات في عملي الحالي',
    'الاستعداد لممارسة الكوتشينغ مستقبلًا',
    'تطوير مهارات مواكبة الآخرين'
  ], true, true);

  paragraph('ما أهم الأهداف التي ترغبون في تحقيقها من هذا التكوين؟', true);

  checkboxes('ما المهارات التي ترغبون في تطويرها؟', [
    'الإصغاء الفعال',
    'التواصل الفعال',
    'طرح الأسئلة المفتوحة',
    'تحديد الأهداف',
    'الوعي بالذات',
    'مواكبة التغيير',
    'بناء الثقة المهنية'
  ], true, true);

  paragraph(
    'كيف تتوقعون الاستفادة من هذا التكوين في حياتكم الشخصية أو المهنية؟',
    false
  );

  // القسم الرابع: الاستعداد للتكوين عن بُعد
  form.addPageBreakItem()
    .setTitle('القسم الرابع: التكوين عن بُعد');

  multipleChoice('هل تتوفرون على جهاز واتصال بالإنترنت للمشاركة؟', [
    'نعم، تتوفر لدي جميع المتطلبات',
    'لدي بعض الصعوبات التقنية',
    'أحتاج إلى معرفة المتطلبات أولًا'
  ], true);

  checkboxes('ما الأوقات التي تناسبكم للمشاركة؟', [
    'صباحًا',
    'بعد الظهر',
    'مساءً',
    'نهاية الأسبوع',
    'حسب جدول التكوين'
  ], true);

  paragraph('هل لديكم أسئلة أو احتياجات خاصة تودون إبلاغ الأكاديمية بها؟', false);

  // القسم الخامس: التواصل وتأكيد المعلومات
  form.addPageBreakItem()
    .setTitle('القسم الخامس: التواصل والموافقة');

  multipleChoice('ما وسيلة التواصل التي تفضلونها؟', [
    'البريد الإلكتروني',
    'الهاتف',
    'واتساب'
  ], true);

  checkboxes('تأكيد صحة المعلومات', [
    'أؤكد أن المعلومات التي قدمتها صحيحة حسب علمي.'
  ], true);

  const consentText = PRIVACY_URL
    ? 'أوافق على استخدام بياناتي لمعالجة طلب التسجيل والتواصل معي بشأن هذا التكوين، وفق سياسة الخصوصية المعتمدة لدى الأكاديمية.'
    : 'أوافق على استخدام بياناتي لمعالجة طلب التسجيل والتواصل معي بشأن هذا التكوين فقط.';

  const consent = checkboxes('الموافقة على استخدام البيانات', [consentText], true);
  if (PRIVACY_URL) {
    consent.setHelpText('للاطلاع على سياسة الخصوصية: ' + PRIVACY_URL);
  }

  // ربط الردود بجدول Google Sheets
  const ss = SpreadsheetApp.create(
    'ردود استمارة التسجيل — التكوين الأساسي في الكوتشينغ'
  );
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('رابط تعديل الاستمارة: ' + form.getEditUrl());
  Logger.log('رابط مشاركة الاستمارة: ' + form.getPublishedUrl());
  Logger.log('رابط جدول الردود: ' + ss.getUrl());
}
