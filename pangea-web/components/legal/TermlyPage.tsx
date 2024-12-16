import { Skeleton } from '@mui/material';
import axios from 'axios';
import { titleCase } from 'lib';
import { useEffect, useState } from 'react';
import { ActionContainer } from '../shared';
import { TableOfContentsDocumentTab } from './TableOfContentsDocumentTab';

interface LinkType {
  href: string;
  text: string;
}

export const TermlyPage = ({ documentGuid }: { documentGuid: string }) => {
  const [myHtml, setMyHtml] = useState<string>('');
  const [links, setLinks] = useState<LinkType[]>([]);
  useEffect(() => {
    axios(
      `https://app.termly.io/api/v1/snippets/documents/${documentGuid}`,
    ).then((uuidContent) => {
      axios(
        `https://app.termly.io/api/v1/snippets/websites/${uuidContent.data.uuid}/documents/${documentGuid}/preview`,
      ).then((res) => {
        const jsonContent = res.data;
        const rawContent = String(jsonContent.content);
        const displayContent = rawContent
          .replace(/Arial/g, 'SuisseNeue')
          //.replace(/\sstyle="[a-zA-Z0-9\s\-:;,.()#%]*"/g, '')
          .replace(/\salign="center"/g, '');
        const parser = new DOMParser();
        const doc = parser.parseFromString(displayContent, 'text/html');
        const allElements = doc.querySelectorAll('*');
        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i];
          el.removeAttribute('style');
          if (el.className === 'MsoNormal') {
            el.removeAttribute('class');
          }
          if (
            el.localName === 'style' &&
            el.textContent?.indexOf('heading_1')
          ) {
            el.textContent = `
            [data-custom-class='body'], [data-custom-class='body'] * {
              font-family: 'SuisseNeue';
              font-weight: 400;
              font-size: 1rem;
              line-height: 1.3;
                }
        [data-custom-class='title'], [data-custom-class='title'] * {
              font-family: 'SuisseIntlCond';
              font-weight: 500;
              font-size: 2.5rem;
              line-height: 1;
              text-transform: uppercase;
                }
        [data-custom-class='subtitle'], [data-custom-class='subtitle'] * {
          font-family: 'SuisseNeue';
          font-weight: 500;
          font-size: 0.8125rem;
          line-height: 1.3;
          text-transform: uppercase;
                }
        [data-custom-class='heading_1'], [data-custom-class='heading_1'] * {
              font-family: 'SuisseIntlCond';
              font-weight: 500;
              font-size: 1.5rem;
              line-height: 1;
              text-transform: uppercase;
                }
        [data-custom-class='heading_2'], [data-custom-class='heading_2'] * {
              font-family: 'SuisseIntlCond';
              font-weight: 500;
              font-size: 1rem;
              line-height: 1;
              text-transform: uppercase;
                }
        [data-custom-class='body_text'], [data-custom-class='body_text'] * {
              font-family: 'SuisseNeue';
              font-weight: 400;
              font-size: 1rem;
              line-height: 1.3;
                }
        [data-custom-class='link'], [data-custom-class='link'] * {
                  color: #3030F1 !important;
        word-break: break-word !important;
                }
          `;
          }
        }

        const allATags = doc.getElementsByTagName('a');
        const matches = [];
        for (let i = 0; i < allATags.length; i++) {
          const el = allATags[i];
          if (
            el.getAttribute('data-custom-class') === 'link' && //it's tagged as a link with the custom data-custom-class attribute
            el.getAttribute('href')?.startsWith('#') && //Looks like a link to a bookmark
            /\d+\.\s[\w\s?]+/.test(el.innerText) //ensures the text starts with number, then a dot, then a space, then some text
          ) {
            const text = titleCase(el.innerText).replace(/^\d+.\s/, '');

            matches.push({ href: el.href, text });
          }
        }
        setLinks(matches);
        setMyHtml(doc.documentElement.innerHTML);
      });
    });
  }, [documentGuid]);
  return (
    <TableOfContentsDocumentTab
      mainChildren={[
        <>
          <ActionContainer paddingTop={'80px'}>
            {myHtml.length === 0 ? (
              <Skeleton variant='text' />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: myHtml }} />
            )}
          </ActionContainer>
        </>,
      ]}
      listItems={[
        {
          title: true,
          text: 'Jump to a section:',
        },
        ...links,
      ]}
    />
  );
};
export default TermlyPage;
