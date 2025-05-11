import { GITHUB_LINK, ONCHAINKIT_LINK } from 'src/links';
import { ExternalLinkSvg } from 'src/svg/ExternalLinkSvg';

export default function OnchainStoreSummary() {
  return (
    <div className="flex flex-col justify-start border-gray-200 border-b p-4 py-6 md:border-r md:border-b-0 lg:border-r">
      <div className="flex flex-row items-center justify-start space-x-4">
        <a
          href={GITHUB_LINK}
          className="flex cursor-pointer items-center"
          target="_blank"
          rel="noreferrer"
        >
          <p className="text-sm leading-relaxed">FORK THIS TEMPLATE</p>
          <span className="pl-1">
            <ExternalLinkSvg />
          </span>
        </a>
        <a
          href={ONCHAINKIT_LINK}
          className="flex cursor-pointer items-center"
          target="_blank"
          rel="noreferrer"
        >
          <p className="text-sm leading-relaxed">VIEW DOCS</p>
          <span className="pl-1">
            <ExternalLinkSvg />
          </span>
        </a>
      </div>
    </div>
  );
}
