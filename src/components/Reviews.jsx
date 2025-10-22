import { useState } from 'react';
import { StarIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

export default function Reviews({ productId, productName = 'Produit' }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Marie Diallo',
      rating: 5,
      date: new Date('2024-10-15'),
      text: 'Produit excellent! Livraison rapide et bien emballé. Très satisfait.',
      verified: true,
    },
    {
      id: 2,
      author: 'Ahmed Fall',
      rating: 4,
      date: new Date('2024-10-10'),
      text: 'Bon rapport qualité-prix. Conforme à la description.',
      verified: true,
    },
    {
      id: 3,
      author: 'Fatou Sarr',
      rating: 5,
      date: new Date('2024-10-05'),
      text: 'Parfait! Recommande vivement.',
      verified: true,
    },
  ]);

  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    text: '',
  });

  const [showForm, setShowForm] = useState(false);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.author.trim() || !formData.text.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      author: formData.author,
      rating: formData.rating,
      date: new Date(),
      text: formData.text,
      verified: false,
    };

    setReviews([newReview, ...reviews]);
    setFormData({ author: '', rating: 5, text: '' });
    setShowForm(false);
  };

  const StarRating = ({ rating, interactive = false, onChange = null }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => interactive && onChange && onChange(star)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            {star <= rating ? (
              <StarIcon className={`w-5 h-5 ${interactive ? 'text-yellow-400' : 'text-yellow-400'}`} />
            ) : (
              <StarOutline className="w-5 h-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Avis clients</h3>

        {/* Average Rating */}
        <div className="flex items-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">{avgRating}</div>
            <div className="flex justify-center my-2">
              <StarRating rating={Math.round(avgRating)} />
            </div>
            <p className="text-sm text-gray-600">{reviews.length} avis</p>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{rating}⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Review Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
        >
          {showForm ? 'Annuler' : 'Ajouter un avis'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-blue-50 rounded-xl p-6 space-y-4">
          <h4 className="font-bold text-gray-900">Votre avis sur "{productName}"</h4>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Votre nom"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
            <StarRating
              rating={formData.rating}
              interactive={true}
              onChange={(rating) => setFormData({ ...formData, rating })}
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Commentaire</label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Partagez votre expérience..."
              rows="4"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            Publier l'avis
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="font-bold text-gray-900 text-lg">Les avis les plus récents</h4>
        {reviews.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Aucun avis pour le moment. Soyez le premier!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-10 h-10 text-gray-400" />
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {review.author}
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Achat vérifié ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {review.date.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {reviews.length > 3 && (
        <button className="w-full py-3 text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition-all">
          Voir tous les avis ({reviews.length})
        </button>
      )}
    </div>
  );
}
