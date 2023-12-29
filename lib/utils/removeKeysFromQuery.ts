import qs from 'query-string';
import { UrlQueryParams } from './formUrlQuery';

interface RemoveUrlQueryParams {
	params: string;
	keysToRemove: string[];
}

const removeKeysFromQuery = ({
	params,
	keysToRemove,
}: RemoveUrlQueryParams) => {
	const currentUrl = qs.parse(params);
	keysToRemove.forEach(key => {
		delete currentUrl[key];
	});

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{ skipNull: true }
	);
};

export default removeKeysFromQuery;
