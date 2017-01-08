const gigs = require('gigs')

// process.env.AUTHENTICJOBS_API_KEY

var adapters = [
	require('gigs-adapter-remotebase'),
	require('gigs-adapter-stackoverflow-jobs'),
	require('gigs-adapter-nofluffjobs'),
	require('gigs-adapter-landingjobs'),
	require('gigs-adapter-codepen-jobs'),
	require('gigs-adapter-dribbble-jobs'),
	require('gigs-adapter-authenticjobs'),
	require('gigs-adapter-crunchboard'),
	require('gigs-adapter-github-jobs')
]

gigs(adapters)
  .process()
  .then(gigs => {
    console.log(gigs);
    //=> [ {title: 'Senior Node.js Developer'}, ... ]
  });
