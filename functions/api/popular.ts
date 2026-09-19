import {json} from '../../lib/engagement/http';
import {publicReport} from '../../lib/engagement/reports';
export const onRequest: PagesFunction<Env> = async ({request,env}) => {
 if (request.method !== 'GET') return json({error:'method_not_allowed'},405,{'Allow':'GET'});
 try { return json(await publicReport(env.DB),200,{'Cache-Control':'public, max-age=300'}); }
 catch { return json({updatedAt:null,popular:[],helpful:[]},503); }
};
