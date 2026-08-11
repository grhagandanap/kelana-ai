# function to print trip summary
def print_trip_summary(destination, country, days, budget, currency, travel_month):
    
    print(30*"=")
    print("\nKelanaAI\n")
    print(30*"=")
    
    print(f"Destination : {destination}")
    print(f"Country     : {country}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget}")
    print(f"Currency    : {currency}")
    print(f"Travel month: {travel_month}")


destination     = input("Enter destination: ")
country         = input("Enter country: ")
days            = int(input("Enter days: "))
budget          = float(input("Enter budget: "))
currency        = input("Enter currency: ")
travel_month    = input("Enter travel month: ")

# invoke function
print_trip_summary(destination, country, days, budget, currency, travel_month)