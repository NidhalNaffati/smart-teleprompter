import ScriptComparison from "./ScriptComparison.tsx";
import Navigation from "./Navigation.tsx";
import useTextAnalyzerHooks from "../hooks/useTextAnalyzerHooks.ts";

function SpeechToTextAnalyzer() {

  const referenceText: string =
    "باسم الله والصلاة والسلام على رسول الله. السلام عليكم أعضاء لجنة التحكيم، يسعدنا تقديم نموذج تطبيق تقديري يهدف فريقنا إلى تقديمه \n" +
    "هدف التطبيق الرئيسي هو مراقبة قراءة الطفل وتحديد الكلمات التي يلفظها ومقارنتها مع النص المقدم أمامه \n" +
    "يعتمد التطبيق على الذكاء الاصطناعي لتحديد الأخطاء، كما يتضمن خاصية تتبع الفقرات، حيث ينتقل تلقائيًا إلى الفقرة التالية بعد انتهاء قراءة فقرة محددة ";

  const referenceParagraphs: string[] = referenceText.split("\n");

  const {
    recognizedText,
    currentParagraphIndex,
    handleResetClick,
    goToNextParagraph,
    goToPreviousParagraph,
  } = useTextAnalyzerHooks(referenceParagraphs);

  const isNextDisabled =
    currentParagraphIndex === referenceParagraphs.length - 1;
  const isPreviousDisabled = currentParagraphIndex === 0;

  return (
    <>
      <div>
        <Navigation
          goToPreviousParagraph={goToPreviousParagraph}
          goToNextParagraph={goToNextParagraph}
          reset={handleResetClick}
          isPreviousDisabled={isPreviousDisabled}
          isNextDisabled={isNextDisabled}
        />
        <h2>
          <ScriptComparison
            recognizedText={recognizedText}
            currentParagraphIndex={currentParagraphIndex}
            referenceParagraphs={referenceParagraphs}
          />
        </h2>
      </div>
    </>
  );
}

export default SpeechToTextAnalyzer;
