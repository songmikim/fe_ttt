import { MainTitle } from "@/app/_global/components/TitleBox";
import ResultContainer from "../containers/ResultContainer"

export default function ResultPage() {
  return (
    <>
      <MainTitle center="true" border="true">분리수거 감지 결과</MainTitle>
      <ResultContainer />
    </>
  );
}
