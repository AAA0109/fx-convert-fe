import { DownloadSharp } from '@mui/icons-material';
import { PangeaButton } from 'components/shared';

interface DownloadAsTxtProps {
  fileName: string;
  fileContent: string[];
}

const DownloadAsTxt = (props: DownloadAsTxtProps) => {
  const downloadTxtFile = () => {
    const element = document.createElement('a');
    const file = new Blob(formatBackupCodesToPrint(props.fileContent), {
      type: 'application/pdf',
    });
    element.href = URL.createObjectURL(file);
    element.download = props.fileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const formatBackupCodesToPrint = (codesToFormat: string[]) => {
    const formatedArray: string[] = [];

    codesToFormat.map((code, index) => {
      formatedArray.push(`Backup Code ${index + 1}: ` + code + '\n');
    });
    return formatedArray;
  };

  return (
    <PangeaButton
      onClick={downloadTxtFile}
      color='info'
      endIcon={<DownloadSharp></DownloadSharp>}
    >
      Download (TXT)
    </PangeaButton>
  );
};

export default DownloadAsTxt;
