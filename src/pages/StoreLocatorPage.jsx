import { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const STORES = [
  {
    id: 1,
    name: 'Almira Flagship Store - Colaba',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '123 Fashion Street, Colaba, Mumbai, Maharashtra 400001',
    phone: '+91 98765 43210',
    email: 'colaba@almira.com',
    hours: {
      weekdays: '10:00 AM - 8:00 PM',
      saturday: '10:00 AM - 9:00 PM',
      sunday: '11:00 AM - 7:00 PM',
    },
    features: ['Personal Styling', 'Custom Design', 'Gift Wrapping', 'Repair Services'],
    mapUrl: 'https://goo.gl/maps/example1',
  },
  {
    id: 2,
    name: 'Almira - Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '45 Linking Road, Bandra West, Mumbai, Maharashtra 400050',
    phone: '+91 98765 43211',
    email: 'bandra@almira.com',
    hours: {
      weekdays: '11:00 AM - 8:30 PM',
      saturday: '11:00 AM - 9:00 PM',
      sunday: '12:00 PM - 7:00 PM',
    },
    features: ['Personal Styling', 'Gift Wrapping', 'Repair Services'],
    mapUrl: 'https://goo.gl/maps/example2',
  },
  {
    id: 3,
    name: 'Almira - Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    address: '78 Connaught Place, New Delhi, Delhi 110001',
    phone: '+91 98765 43212',
    email: 'cp@almira.com',
    hours: {
      weekdays: '10:30 AM - 8:00 PM',
      saturday: '10:30 AM - 8:30 PM',
      sunday: 'Closed',
    },
    features: ['Personal Styling', 'Custom Design', 'Gift Wrapping'],
    mapUrl: 'https://goo.gl/maps/example3',
  },
  {
    id: 4,
    name: 'Almira - Saket',
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Select Citywalk Mall, Saket, New Delhi, Delhi 110017',
    phone: '+91 98765 43213',
    email: 'saket@almira.com',
    hours: {
      weekdays: '11:00 AM - 9:00 PM',
      saturday: '11:00 AM - 10:00 PM',
      sunday: '11:00 AM - 9:00 PM',
    },
    features: ['Personal Styling', 'Gift Wrapping'],
    mapUrl: 'https://goo.gl/maps/example4',
  },
  {
    id: 5,
    name: 'Almira - Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    address: '89 100 Feet Road, Indiranagar, Bangalore, Karnataka 560038',
    phone: '+91 98765 43214',
    email: 'indiranagar@almira.com',
    hours: {
      weekdays: '10:00 AM - 8:00 PM',
      saturday: '10:00 AM - 8:30 PM',
      sunday: '11:00 AM - 7:00 PM',
    },
    features: ['Personal Styling', 'Custom Design', 'Gift Wrapping', 'Repair Services'],
    mapUrl: 'https://goo.gl/maps/example5',
  },
  {
    id: 6,
    name: 'Almira - Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    address: '56 Forum Mall, Koramangala, Bangalore, Karnataka 560095',
    phone: '+91 98765 43215',
    email: 'koramangala@almira.com',
    hours: {
      weekdays: '11:00 AM - 9:00 PM',
      saturday: '11:00 AM - 9:30 PM',
      sunday: '11:00 AM - 9:00 PM',
    },
    features: ['Personal Styling', 'Gift Wrapping'],
    mapUrl: 'https://goo.gl/maps/example6',
  },
];

const CITIES = ['All Cities', 'Mumbai', 'New Delhi', 'Bangalore'];

export default function StoreLocatorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedStore, setSelectedStore] = useState(null);

  const filteredStores = STORES.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = selectedCity === 'All Cities' || store.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Store Locator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visit one of our retail stores for a personalized shopping experience. Try on pieces,
            get expert styling advice, and enjoy complimentary services.
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by city, area, or store name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CITIES.map((city) => (
                <Button
                  key={city}
                  variant={selectedCity === city ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Store List */}
          <div className="lg:col-span-1 space-y-4">
            {filteredStores.length === 0 ? (
              <Card className="p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No stores found</h3>
                <p className="text-sm text-gray-600">
                  Try adjusting your search or filter to find stores.
                </p>
              </Card>
            ) : (
              filteredStores.map((store) => (
                <Card
                  key={store.id}
                  className={`p-5 cursor-pointer transition-all hover:shadow-md ${
                    selectedStore?.id === store.id ? 'border-2 border-amber-500 bg-amber-50' : ''
                  }`}
                  onClick={() => setSelectedStore(store)}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{store.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{store.phone}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="default" size="sm">
                      {store.city}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Store Details */}
          <div className="lg:col-span-2">
            {selectedStore ? (
              <Card className="p-8 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedStore.name}</h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex gap-4">
                    <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-700">{selectedStore.address}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => window.open(selectedStore.mapUrl, '_blank')}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex gap-4">
                    <Phone className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Contact</h3>
                      <p className="text-gray-700 mb-1">Phone: {selectedStore.phone}</p>
                      <p className="text-gray-700">Email: {selectedStore.email}</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4">
                    <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3">Store Hours</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Monday - Friday</span>
                          <span className="font-medium">{selectedStore.hours.weekdays}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Saturday</span>
                          <span className="font-medium">{selectedStore.hours.saturday}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Sunday</span>
                          <span className={`font-medium ${selectedStore.hours.sunday === 'Closed' ? 'text-red-600' : ''}`}>
                            {selectedStore.hours.sunday}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Available Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStore.features.map((feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t flex gap-3">
                    <Button
                      onClick={() => window.open(selectedStore.mapUrl, '_blank')}
                      className="flex-1"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = `tel:${selectedStore.phone}`}
                      className="flex-1"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Store
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center h-full flex flex-col items-center justify-center">
                <MapPin className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Store</h3>
                <p className="text-gray-600 max-w-md">
                  Click on any store from the list to view details, hours, and get directions.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Store Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">👗</div>
            <h3 className="font-semibold text-gray-900 mb-2">Personal Styling</h3>
            <p className="text-sm text-gray-600">
              Get expert advice from our in-store stylists to find pieces that match your style.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Try Before You Buy</h3>
            <p className="text-sm text-gray-600">
              See how pieces look and feel in person before making your purchase.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="font-semibold text-gray-900 mb-2">Repair & Services</h3>
            <p className="text-sm text-gray-600">
              Free cleaning, polishing, and professional repair services at select locations.
            </p>
          </Card>
        </div>

        {/* Opening Soon */}
        <Card className="p-8 mt-12 bg-gradient-to-br from-amber-50 to-orange-50 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">More Stores Coming Soon!</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            We're expanding to more cities across India. Subscribe to our newsletter to be notified
            when we open a store near you.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Subscribe to Newsletter
          </Button>
        </Card>
      </div>
    </div>
  );
}
