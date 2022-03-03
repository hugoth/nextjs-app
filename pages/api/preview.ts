import { NextApiResponse } from 'next'

export default (req, res: NextApiResponse) => {
  res.setPreviewData({})
  // redirects to the page you want to preview

  res.redirect(req.query.route)

  // /api/preview?route={appRouteToPreview} in browser url
}
