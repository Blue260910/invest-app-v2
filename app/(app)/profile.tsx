import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { View, ScrollView, Image } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Edit2, User as UserIcon, AtSign, Clock, Shield } from 'lucide-react-native';
import { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

// InfoItem component for displaying label-value pairs with an icon
type InfoItemProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
};

function InfoItem({ icon, label, value }: InfoItemProps) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ marginRight: 8 }}>{icon}</View>
            <View>
                <Text className="font-medium">{label}:</Text>
                <Text className="text-zinc-700">{value}</Text>
            </View>
        </View>
    );
}

export default function ProfileScreen() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [lastLogin, setLastLogin] = useState<Date | null>(null);
    const [cepData, setCepData] = useState<any>(null);
    const email = user?.email || 'Sem e-mail';
    const username = user?.user_metadata?.first_name || 'Usuário';
    const avatar = user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

    useEffect(() => {
        if (user?.created_at) {
            setLastLogin(new Date(user.last_sign_in_at || user.created_at));
        }

        console.log('Userr:', user);


        if (user?.user_metadata?.address && !cepData) {
            async function buscarCep(cep: string) {
                const session = supabase.auth.getSession
                    ? await supabase.auth.getSession()
                    : null;
                const token = session?.data?.session?.access_token;
                const res = await fetch("https://oziwendirtmqquvqkree.supabase.co/functions/v1/CEP-Finder", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` }),
                    },
                    body: JSON.stringify({ cep }),
                });
                const data = await res.json();
                setCepData(data);
            }
            buscarCep(user.user_metadata.address.replace(/\D/g, ''))
                .catch(error => {
                    console.error('Error fetching address data:', error);
                });
        }
    }, [user, cepData]);

    const formatDate = (date: Date | null) => {
        if (!date) return 'Desconhecido';
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <Avatar alt={username + "'s Avatar"}>
                        <AvatarImage source={{ uri: avatar }} />
                                                <AvatarFallback>
                                                    {typeof username === 'string' ? (
                                                        <Text className="text-lg font-bold">
                                                            {username.split(' ').map((n: string) => n && n[0] ? n[0] : '').join('').toUpperCase() || 'U'}
                                                        </Text>
                                                    ) : (
                                                        <Text className="text-lg font-bold">U</Text>
                                                    )}
                                                </AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" className="mt-2" onPress={() => {/* TODO: Editar avatar */}}>
                        <Edit2 size={18} /> <Text>Editar foto</Text>
                    </Button>
                    <Text className="text-xl font-bold mt-2">{username}</Text>
                    <Text className="text-base text-zinc-700 mt-1">{email}</Text>
                </View>
                <Card className="w-full max-w-md self-center">
                    <CardHeader>
                        <CardTitle className="text-lg">Informações da Conta</CardTitle>
                    </CardHeader>
                    <Separator className="my-2" />
                    <CardContent className="gap-2">
                        <InfoItem icon={<UserIcon size={20} color="#6366F1" />} label="Nome de usuário" value={username} />
                        <InfoItem icon={<AtSign size={20} color="#6366F1" />} label="E-mail" value={email} />
                        <InfoItem icon={<Clock size={20} color="#6366F1" />} label="Último login" value={formatDate(lastLogin)} />
                        <InfoItem icon={<Edit2 size={20} color="#6366F1" />} label="Nome completo" value={user?.user_metadata?.last_name || 'Sem nome completo'} />
                        <InfoItem icon={<Edit2 size={20} color="#6366F1" />} label="Telefone" value={user?.user_metadata?.telephone || 'Sem telefone'} />
                        <InfoItem icon={<Edit2 size={20} color="#6366F1" />} label="CEP cadastrado" value={user?.user_metadata?.address || 'Sem endereço'} />
                        {cepData && (
                            <InfoItem icon={<Edit2 size={20} color="#6366F1" />} label="Logradouro" value={cepData.logradouro || 'Sem logradouro'} />
                        )}
                        <InfoItem icon={<Shield size={20} color="#6366F1" />} label="Status da conta" value="Ativa" />
                    </CardContent>
                </Card>
                <View className="mt-8 gap-4 w-full max-w-md self-center">
                    <Button className="w-full" variant="outline" onPress={() => {/* TODO: Navegar para edição de perfil */}}>
                        <Text>Editar perfil</Text>
                    </Button>
                    <Button className="w-full" variant="destructive" onPress={() => {/* TODO: Sair */}}>
                        <Text>Sair</Text>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}