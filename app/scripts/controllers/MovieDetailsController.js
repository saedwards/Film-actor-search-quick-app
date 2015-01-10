(function (app) {

	app.controller('MovieDetails', [
		'$scope',
		'$routeParams',
		'$location',
		'$sce',
		'movieDBConfig',
		'utils',
		'changeBackdrop',
		'windowNotifications',
		'basicMovieInformation',
		'movieVideos',
		function ($scope, $routeParams, $location, $sce, movieDBConfig, utils, changeBackdrop, windowNotifications, basicMovieInformation, movieVideos) {

			console.log($routeParams.id);

			var movieId = parseInt($routeParams.id),
				doError = function () {
					windowNotifications.addMessage(err.data ? 'Error: ' + err.data.status_message : 'Sorry, an error occurred.')
				};

			if(movieId !== movieId) {

				$location.path('/404');
				return;

			}

			function applyMovieVideos(data) {

				$scope.videos = data.results.map(function(item) {

					var isYouTube = item.site === 'YouTube';

					return isYouTube ? {

						name: item.name,
						path: $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + item.key)

					} : false;

				});

			}

			function applyMovieDetailsData(data) {

				$scope.movie = data;

				movieDBConfig.getConfig(function (res) {

					$scope.genres = utils.formatListLabel(data.genres.map(function (item) {
							return item.name;
						}));

					if($scope.movie.poster_path) {
						$scope.posterImage = res.images.base_url + res.images.poster_sizes[3] + $scope.movie.poster_path;
					}

					changeBackdrop($scope.movie.backdrop_path);

				});

			};

			function loadMovieDetailsData(id) {

				/**
				 * Simpson's movie stub
				 */
				//applyMovieDetailsData({"adult":false,"backdrop_path":"/gMjtdTP6HIi7CDilqXwnX8vouxO.jpg","belongs_to_collection":null,"budget":75000000,"genres":[{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":10751,"name":"Family"}],"homepage":"http://www.simpsonsmovie.com/","id":35,"imdb_id":"tt0462538","original_language":"en","original_title":"The Simpsons Movie","overview":"After Homer accidentally pollutes the town's water supply, Springfield is encased in a gigantic dome by the EPA and the Simpsons are declared fugitives.","popularity":1.20716329399693,"poster_path":"/eCytnEriVur3rT47NWfkgPXD9qs.jpg","production_companies":[{"name":"Twentieth Century Fox Film Corporation","id":306},{"name":"Gracie Films","id":18}],"production_countries":[{"iso_3166_1":"US","name":"United States of America"}],"release_date":"2007-07-27","revenue":527068851,"runtime":87,"spoken_languages":[{"iso_639_1":"en","name":"English"}],"status":"Released","tagline":"See our family. And feel better about yours.","title":"The Simpsons Movie","video":false,"vote_average":6.7,"vote_count":491});

				basicMovieInformation.getResults($routeParams.id)
					.then(function (response) {
						applyMovieDetailsData(response);
					})
					['catch'](function (err) {
						doError(err);
					});

			};

			function loadMovieVideos(id) {

				movieVideos.getResults($routeParams.id)
					.then(function (response) {
						applyMovieVideos(response);
					})
					['catch'](function (err) {
						doError(err);
					});

			};

			loadMovieVideos(movieId);
			loadMovieDetailsData(movieId);

		}]);

}(app));